import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Send, Code2, Play, Copy, Check,
  User as UserIcon, MessageCircle, Settings, Loader2, LogOut, XCircle
} from 'lucide-react';
import { roomAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const RoomEditor = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, connected, joinRoom, leaveRoom, sendMessage, sendCodeChange, endRoom } = useSocket();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('// Start coding here...\n');
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showChat, setShowChat] = useState(true); // Always show chat by default
  const [copiedCode, setCopiedCode] = useState(false);
  const [joined, setJoined] = useState(false);
  const [leavingRoom, setLeavingRoom] = useState(false);
  const [endingRoom, setEndingRoom] = useState(false);
  
  const codeEditorRef = useRef(null);
  const chatEndRef = useRef(null);
  const hasJoinedRef = useRef(false); // Prevent duplicate joins

  useEffect(() => {
    fetchRoom();
    
    return () => {
      // Cleanup when component unmounts
      if (hasJoinedRef.current && roomId) {
        leaveRoom(roomId);
        hasJoinedRef.current = false;
      }
    };
  }, [roomId]);

  useEffect(() => {
    // Only join if socket is ready, room is loaded, and not already joined
    if (socket && room && connected && !joined && !hasJoinedRef.current) {
      console.log('🎯 Attempting to join room:', roomId);
      hasJoinedRef.current = true;
      
      // Join the room
      joinRoom(roomId, (response) => {
        if (response.success) {
          console.log('✅ Successfully joined room');
          setActiveUsers(response.activeUsers);
          setJoined(true);
          
          // Add welcome message
          setMessages(prev => [...prev, {
            type: 'system',
            message: 'You joined the room',
            timestamp: new Date()
          }]);
        } else {
          console.error('❌ Failed to join room:', response.message);
          alert(response.message);
          navigate('/rooms');
          hasJoinedRef.current = false;
        }
      });
    }
  }, [socket, room, connected, joined, roomId]);

  useEffect(() => {
    if (!socket) return;

    // Listen for user joined
    const handleUserJoined = (data) => {
      console.log('👤 User joined:', data.username);
      setActiveUsers(data.activeUsers);
      setMessages(prev => [...prev, {
        type: 'system',
        message: `${data.username} joined the room`,
        timestamp: new Date()
      }]);
    };

    // Listen for user left
    const handleUserLeft = (data) => {
      console.log('👋 User left:', data.username);
      setActiveUsers(data.activeUsers);
      setMessages(prev => [...prev, {
        type: 'system',
        message: `${data.username} left the room`,
        timestamp: new Date()
      }]);
    };

    // Listen for messages
    const handleReceiveMessage = (data) => {
      console.log('💬 Message received from:', data.username);
      setMessages(prev => [...prev, { ...data, type: 'message' }]);
    };

    // Listen for code updates
    const handleCodeUpdate = (data) => {
      console.log('📝 Code updated by:', data.username);
      setCode(data.code);
    };

    // Listen for room ended
    const handleRoomEnded = (data) => {
      console.log('🛑 Room ended:', data.message);
      alert(`${data.message}\n\nCreator: ${data.creatorUsername}`);
      navigate('/rooms');
    };

    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('receive-message', handleReceiveMessage);
    socket.on('code-update', handleCodeUpdate);
    socket.on('room-ended', handleRoomEnded);

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('receive-message', handleReceiveMessage);
      socket.off('code-update', handleCodeUpdate);
      socket.off('room-ended', handleRoomEnded);
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRoom = async () => {
    try {
      const response = await roomAPI.getRoom(roomId);
      setRoom(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Room not found');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (connected) {
      sendCodeChange(roomId, newCode);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !connected) return;

    sendMessage(roomId, messageInput);
    setMessageInput('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm('Are you sure you want to leave this room?')) return;

    setLeavingRoom(true);
    try {
      // Leave the room via API
      await roomAPI.leaveRoom(roomId);
      
      // Leave the socket room
      leaveRoom(roomId);
      
      // Navigate back to rooms page
      navigate('/rooms');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave room');
      setLeavingRoom(false);
    }
  };

  const handleEndRoom = async () => {
    if (!window.confirm('⚠️ Are you sure you want to END this room?\n\nThis will kick out all participants and close the room session.')) return;

    setEndingRoom(true);
    try {
      // End the room via socket
      endRoom(roomId, (response) => {
        if (response.success) {
          // Navigate back to rooms page
          navigate('/rooms');
        } else {
          alert(response.message || 'Failed to end room');
          setEndingRoom(false);
        }
      });
    } catch (error) {
      alert('Failed to end room');
      setEndingRoom(false);
    }
  };

  if (loading || !room) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-cyan-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b-4 border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/rooms')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{room.name}</h1>
                <p className="text-sm text-gray-600">Room Code: {room.roomCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                connected ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-semibold ${
                  connected ? 'text-green-700' : 'text-red-700'
                }`}>
                  {connected ? `${activeUsers.length} online` : 'Disconnected'}
                </span>
              </div>
              
              {/* End Room Button (only for creators) */}
              {room && room.creator._id === user?.id && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEndRoom}
                  disabled={endingRoom}
                  className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-600 px-4 py-2 rounded-full font-semibold border-2 border-orange-200 disabled:opacity-50"
                >
                  {endingRoom ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Ending...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">End Room</span>
                    </>
                  )}
                </motion.button>
              )}

              {/* Leave Room Button (only for non-creators) */}
              {room && room.creator._id !== user?.id && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLeaveRoom}
                  disabled={leavingRoom}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-full font-semibold border-2 border-red-200 disabled:opacity-50"
                >
                  {leavingRoom ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Leaving...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Leave Room</span>
                    </>
                  )}
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition ${
                  showChat 
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white' 
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{showChat ? 'Hide Chat' : 'Show Chat'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col p-4">
          <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-pink-500" />
                <span className="font-bold text-gray-800">Code Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl text-sm font-semibold"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-2 rounded-xl font-semibold"
                >
                  <Play className="w-4 h-4" />
                  Run
                </motion.button>
              </div>
            </div>
            
            <textarea
              ref={codeEditorRef}
              value={code}
              onChange={handleCodeChange}
              className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none bg-gray-50"
              placeholder="Start coding..."
              spellCheck="false"
            />
          </div>
        </div>

        {/* Chat Sidebar - Always visible when showChat is true */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-l-4 border-gray-100 flex flex-col"
            >
              {/* Active Users */}
              <div className="p-4 border-b-2 border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Users ({activeUsers.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {activeUsers.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No active users</p>
                  ) : (
                    activeUsers.map((u, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold">
                          {u.username[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{u.username}</span>
                        {u.userId === user?.id && <span className="text-xs text-gray-500">(You)</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    <p>💬</p>
                    <p className="mt-2">No messages yet</p>
                    <p className="text-xs mt-1">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={msg.type === 'system' ? 'text-center' : ''}>
                      {msg.type === 'system' ? (
                        <span className="text-xs text-gray-500 italic">{msg.message}</span>
                      ) : (
                        <div className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}>
                          <span className="text-xs text-gray-500 mb-1">{msg.username}</span>
                          <div className={`px-4 py-2 rounded-2xl max-w-[80%] break-words ${
                            msg.userId === user?.id
                              ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={connected ? "Type a message..." : "Connecting..."}
                    disabled={!connected}
                    className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
                  />
                  <motion.button
                    whileHover={{ scale: connected ? 1.05 : 1 }}
                    whileTap={{ scale: connected ? 0.95 : 1 }}
                    type="submit"
                    disabled={!connected}
                    className="bg-gradient-to-r from-orange-400 to-pink-400 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoomEditor;
