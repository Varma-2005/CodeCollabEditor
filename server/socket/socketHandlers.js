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
          activeUsers: finalRoom.activeUsers,
          code: finalRoom.code || '// Start coding here...\n',
          language: finalRoom.language || 'javascript',
          messages: finalRoom.messages || []
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
          user: socket.user._id,
          username: socket.user.username,
          message,
          type: 'message',
          timestamp: new Date()
        };

        // Save message to database
        room.messages.push(messageData);
        
        // Keep only last 500 messages to prevent unlimited growth
        if (room.messages.length > 500) {
          room.messages = room.messages.slice(-500);
        }
        
        await room.save();

        // Broadcast message to all users in the room (including sender)
        const broadcastData = {
          id: messageData._id || `${Date.now()}-${socket.id}`,
          userId: socket.user._id,
          username: socket.user.username,
          message,
          timestamp: messageData.timestamp
        };

        io.to(roomId).emit('receive-message', broadcastData);

        console.log(`💬 Message in ${room.name} from ${socket.user.username}: ${message.substring(0, 50)}...`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Code change event
    socket.on('code-change', async ({ roomId, code, language }) => {
      try {
        // Save code to database
        const room = await Room.findByIdAndUpdate(
          roomId,
          {
            code: code,
            language: language || 'javascript',
            lastCodeUpdate: {
              by: socket.user._id,
              at: new Date()
            }
          },
          { new: true }
        );

        if (!room) {
          console.error('Room not found for code update:', roomId);
          return;
        }

        // Only broadcast to others, not to sender
        socket.to(roomId).emit('code-update', {
          code,
          language: language || 'javascript',
          userId: socket.user._id,
          username: socket.user.username
        });

        console.log(`📝 Code saved for room: ${room.name} by ${socket.user.username}`);
      } catch (error) {
        console.error('Code change error:', error);
      }
    });

    // Request code execution approval
    socket.on('request-code-execution', async ({ roomId, code, language, stdin }, callback) => {
      try {
        const room = await Room.findById(roomId);

        if (!room) {
          return callback({ success: false, message: 'Room not found' });
        }

        // Get all active users except the requester
        const otherUsers = room.activeUsers.filter(
          u => u.userId.toString() !== socket.user._id.toString()
        );

        if (otherUsers.length === 0) {
          // No other users, execute directly
          return callback({ 
            success: true, 
            executeDirectly: true,
            message: 'No other users to approve, execute directly' 
          });
        }

        // Create execution request
        const executionRequest = {
          requestedBy: socket.user._id,
          requestedByUsername: socket.user.username,
          code,
          language,
          stdin: stdin || '',
          timestamp: new Date(),
          approvals: [],
          status: 'pending'
        };

        room.codeExecutionRequest = executionRequest;
        await room.save();

        // Notify all other users in the room
        socket.to(roomId).emit('code-execution-requested', {
          requestId: room._id,
          requestedBy: socket.user._id,
          requestedByUsername: socket.user.username,
          language,
          timestamp: executionRequest.timestamp
        });

        console.log(`🎯 ${socket.user.username} requested code execution in room: ${room.name}`);

        callback({ 
          success: true, 
          message: 'Waiting for approval from other participants',
          totalUsers: otherUsers.length
        });
      } catch (error) {
        console.error('Request code execution error:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Approve or reject code execution
    socket.on('code-execution-response', async ({ roomId, approved }, callback) => {
      try {
        const room = await Room.findById(roomId);

        if (!room) {
          return callback({ success: false, message: 'Room not found' });
        }

        if (!room.codeExecutionRequest || room.codeExecutionRequest.status !== 'pending') {
          return callback({ success: false, message: 'No pending execution request' });
        }

        // Add user's approval/rejection
        const approval = {
          userId: socket.user._id,
          username: socket.user.username,
          approved,
          timestamp: new Date()
        };

        room.codeExecutionRequest.approvals.push(approval);

        // Get total active users excluding requester
        const totalUsers = room.activeUsers.filter(
          u => u.userId.toString() !== room.codeExecutionRequest.requestedBy.toString()
        ).length;

        const totalApprovals = room.codeExecutionRequest.approvals.length;
        const approvedCount = room.codeExecutionRequest.approvals.filter(a => a.approved).length;
        const rejectedCount = room.codeExecutionRequest.approvals.filter(a => !a.approved).length;

        console.log(`📊 Execution approval status: ${approvedCount}/${totalUsers} approved, ${rejectedCount} rejected`);

        // If anyone rejects, cancel the request
        if (rejectedCount > 0) {
          room.codeExecutionRequest.status = 'rejected';
          await room.save();

          // Notify everyone that execution was rejected
          io.to(roomId).emit('code-execution-rejected', {
            rejectedBy: socket.user.username,
            requestedBy: room.codeExecutionRequest.requestedByUsername
          });

          console.log(`❌ Code execution rejected by ${socket.user.username}`);

          return callback({ success: true, message: 'Execution request rejected' });
        }

        // Check if everyone approved
        if (approvedCount === totalUsers) {
          room.codeExecutionRequest.status = 'approved';
          await room.save();

          // Notify requester to execute
          io.to(roomId).emit('code-execution-approved', {
            requestedBy: room.codeExecutionRequest.requestedBy,
            code: room.codeExecutionRequest.code,
            language: room.codeExecutionRequest.language,
            stdin: room.codeExecutionRequest.stdin
          });

          console.log(`✅ Code execution approved by all participants in room: ${room.name}`);

          callback({ success: true, message: 'Execution approved by all' });
        } else {
          // Still waiting for more approvals
          await room.save();

          // Notify about approval progress
          io.to(roomId).emit('code-execution-approval-progress', {
            approvedCount,
            totalUsers,
            approvedBy: socket.user.username
          });

          callback({ 
            success: true, 
            message: `Waiting for ${totalUsers - approvedCount} more approval(s)` 
          });
        }
      } catch (error) {
        console.error('Code execution response error:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Cancel code execution request
    socket.on('cancel-code-execution', async ({ roomId }, callback) => {
      try {
        const room = await Room.findById(roomId);

        if (!room) {
          return callback({ success: false, message: 'Room not found' });
        }

        if (!room.codeExecutionRequest) {
          return callback({ success: false, message: 'No execution request to cancel' });
        }

        // Only requester can cancel
        if (room.codeExecutionRequest.requestedBy.toString() !== socket.user._id.toString()) {
          return callback({ success: false, message: 'Only the requester can cancel' });
        }

        room.codeExecutionRequest = undefined;
        await room.save();

        // Notify everyone
        io.to(roomId).emit('code-execution-cancelled', {
          cancelledBy: socket.user.username
        });

        callback({ success: true, message: 'Execution request cancelled' });
      } catch (error) {
        console.error('Cancel code execution error:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Mark execution as completed
    socket.on('code-execution-completed', async ({ roomId }) => {
      try {
        const room = await Room.findById(roomId);

        if (room && room.codeExecutionRequest) {
          room.codeExecutionRequest.status = 'executed';
          await room.save();
        }
      } catch (error) {
        console.error('Mark execution completed error:', error);
      }
    });

    // Sync stdin input across all users
    socket.on('stdin-change', async ({ roomId, stdin }) => {
      try {
        // Broadcast stdin change to all other users in the room
        socket.to(roomId).emit('stdin-update', {
          stdin,
          userId: socket.user._id,
          username: socket.user.username
        });

        console.log(`⌨️ Stdin updated in room ${roomId} by ${socket.user.username}`);
      } catch (error) {
        console.error('Stdin change error:', error);
      }
    });

    // Sync output across all users
    socket.on('output-change', async ({ roomId, output, showOutput }) => {
      try {
        // Broadcast output to all other users in the room
        socket.to(roomId).emit('output-update', {
          output,
          showOutput,
          userId: socket.user._id,
          username: socket.user.username
        });

        console.log(`📺 Output updated in room ${roomId} by ${socket.user.username}`);
      } catch (error) {
        console.error('Output change error:', error);
      }
    });

    // End room (creator only)
    socket.on('end-room', async ({ roomId }, callback) => {
      try {
        const room = await Room.findById(roomId);

        if (!room) {
          return callback({ success: false, message: 'Room not found' });
        }

        // Check if user is the creator
        if (room.creator.toString() !== socket.user._id.toString()) {
          return callback({ success: false, message: 'Only the creator can end the room' });
        }

        // Notify all users in the room that it's ending
        io.to(roomId).emit('room-ended', {
          message: 'The room has been ended by the creator',
          creatorUsername: socket.user.username
        });

        // Clear all active users
        await Room.findByIdAndUpdate(
          roomId,
          { $set: { activeUsers: [] } }
        );

        // Make everyone leave the socket room
        const socketsInRoom = await io.in(roomId).fetchSockets();
        socketsInRoom.forEach(s => {
          s.leave(roomId);
          if (s.currentRoom === roomId) {
            s.currentRoom = null;
          }
        });

        callback({ success: true, message: 'Room ended successfully' });

        console.log(`🛑 Room ${room.name} ended by creator: ${socket.user.username}`);
      } catch (error) {
        console.error('End room error:', error);
        callback({ success: false, message: error.message });
      }
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
