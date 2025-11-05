import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token } = useAuth();
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        console.log('🔌 Disconnecting socket (no token)');
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Prevent creating multiple socket connections
    if (socketRef.current?.connected) {
      console.log('✅ Socket already connected, reusing connection');
      return;
    }

    console.log('🔌 Creating new socket connection');
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
      
      // Clear any pending reconnection timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setConnected(false);
      
      // If disconnected due to client action, don't try to reconnect
      if (reason === 'io client disconnect') {
        return;
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      setConnected(false);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt:', attemptNumber);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
      setConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error.message);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after all attempts');
      setConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('⚠️ Socket error:', error);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log('🧹 Cleaning up socket connection');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  const joinRoom = (roomId, callback) => {
    if (socketRef.current?.connected) {
      console.log('📨 Emitting join-room:', roomId);
      socketRef.current.emit('join-room', { roomId }, callback);
    } else {
      console.warn('⚠️ Socket not connected, cannot join room');
      if (callback) {
        callback({ success: false, message: 'Socket not connected' });
      }
    }
  };

  const leaveRoom = (roomId, callback) => {
    if (socketRef.current?.connected) {
      console.log('📨 Emitting leave-room:', roomId);
      socketRef.current.emit('leave-room', { roomId }, callback);
    }
  };

  const sendMessage = (roomId, message) => {
    if (socketRef.current?.connected) {
      console.log('📨 Sending message to room:', roomId);
      socketRef.current.emit('send-message', { roomId, message });
    } else {
      console.warn('⚠️ Cannot send message, socket not connected');
    }
  };

  const sendCodeChange = (roomId, code, language) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('code-change', { roomId, code, language });
    }
  };

  const sendCursorMove = (roomId, position) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('cursor-move', { roomId, position });
    }
  };

  const endRoom = (roomId, callback) => {
    if (socketRef.current?.connected) {
      console.log('📨 Emitting end-room:', roomId);
      socketRef.current.emit('end-room', { roomId }, callback);
    } else {
      console.warn('⚠️ Socket not connected, cannot end room');
      if (callback) {
        callback({ success: false, message: 'Socket not connected' });
      }
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      joinRoom,
      leaveRoom,
      sendMessage,
      sendCodeChange,
      sendCursorMove,
      endRoom
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
