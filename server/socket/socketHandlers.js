const Room = require('../models/Room');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketHandlers = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.id})`);
    
    // Track current room for this socket
    socket.currentRoom = null;

    // Join a room
    socket.on('join-room', async ({ roomId }, callback) => {
      try {
        // If already in a room, leave it first
        if (socket.currentRoom && socket.currentRoom !== roomId) {
          socket.leave(socket.currentRoom);
          await Room.findByIdAndUpdate(
            socket.currentRoom,
            { $pull: { activeUsers: { socketId: socket.id } } }
          );
        }

        const room = await Room.findById(roomId);

        if (!room) {
          return callback({ success: false, message: 'Room not found' });
        }

        // Check if user is a member
        const isMember = room.members.some(
          member => member.user.toString() === socket.user._id.toString()
        );

        if (!isMember) {
          return callback({ success: false, message: 'You are not a member of this room' });
        }

        // Join socket room
        socket.join(roomId);
        socket.currentRoom = roomId;

        // Use atomic operation to update active users
        const activeUser = {
          userId: socket.user._id,
          socketId: socket.id,
          username: socket.user.username,
          joinedAt: new Date()
        };

        // Remove any existing entries for this user, then add new one
        await Room.findByIdAndUpdate(
          roomId,
          { $pull: { activeUsers: { userId: socket.user._id } } }
        );

        // Add the new active user entry
        const finalRoom = await Room.findByIdAndUpdate(
          roomId,
          { $push: { activeUsers: activeUser } },
          { new: true }
        );

        // Notify others in the room
        socket.to(roomId).emit('user-joined', {
          userId: socket.user._id,
          username: socket.user.username,
          activeUsers: finalRoom.activeUsers
        });

        callback({
          success: true,
          message: 'Joined room successfully',
          activeUsers: finalRoom.activeUsers
        });

        console.log(`👥 ${socket.user.username} joined room: ${room.name} (${socket.id})`);
      } catch (error) {
        console.error('Join room error:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Leave a room
    socket.on('leave-room', async ({ roomId }, callback) => {
      try {
        const room = await Room.findById(roomId);

        if (room) {
          socket.leave(roomId);
          
          if (socket.currentRoom === roomId) {
            socket.currentRoom = null;
          }

          // Use atomic operation to remove from active users
          const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $pull: { activeUsers: { socketId: socket.id } } },
            { new: true }
          );

          if (updatedRoom) {
            // Notify others
            socket.to(roomId).emit('user-left', {
              userId: socket.user._id,
              username: socket.user.username,
              activeUsers: updatedRoom.activeUsers
            });
          }

          console.log(`👋 ${socket.user.username} left room: ${room.name} (${socket.id})`);
        }

        if (callback) {
          callback({ success: true });
        }
      } catch (error) {
        console.error('Leave room error:', error);
        if (callback) {
          callback({ success: false, message: error.message });
        }
      }
    });

    // Send message in room
    socket.on('send-message', async ({ roomId, message }) => {
      try {
        // Verify room exists
        const room = await Room.findById(roomId);

        if (!room) {
          return socket.emit('error', { message: 'Room not found' });
        }

        const messageData = {
          id: `${Date.now()}-${socket.id}`,
          userId: socket.user._id,
          username: socket.user.username,
          message,
          timestamp: new Date()
        };

        // Broadcast message to all users in the room (including sender)
        io.to(roomId).emit('receive-message', messageData);

        console.log(`💬 Message in ${room.name} from ${socket.user.username}: ${message.substring(0, 50)}...`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Code change event
    socket.on('code-change', ({ roomId, code }) => {
      // Only broadcast to others, not to sender
      socket.to(roomId).emit('code-update', {
        code,
        userId: socket.user._id,
        username: socket.user.username
      });
    });

    // Cursor position update
    socket.on('cursor-move', ({ roomId, position }) => {
      socket.to(roomId).emit('cursor-update', {
        position,
        userId: socket.user._id,
        username: socket.user.username
      });
    });

    // Disconnect
    socket.on('disconnect', async (reason) => {
      try {
        console.log(`❌ User disconnecting: ${socket.user.username} (${socket.id}) - Reason: ${reason}`);
        
        // Use atomic operation to remove user from all active rooms
        await Room.updateMany(
          { 'activeUsers.socketId': socket.id },
          { $pull: { activeUsers: { socketId: socket.id } } }
        );

        // Get room to notify others
        if (socket.currentRoom) {
          const room = await Room.findById(socket.currentRoom);
          if (room) {
            // Get updated active users after removal
            const updatedRoom = await Room.findById(socket.currentRoom);
            
            socket.to(socket.currentRoom).emit('user-left', {
              userId: socket.user._id,
              username: socket.user.username,
              activeUsers: updatedRoom ? updatedRoom.activeUsers : []
            });
          }
        }

        console.log(`✔️ Cleanup completed for ${socket.user.username}`);
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });
  });
};

module.exports = socketHandlers;
