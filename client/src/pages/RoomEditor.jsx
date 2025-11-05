import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Send, Code2, Play, Copy, Check,
  MessageCircle, Loader2, LogOut, XCircle,
  Terminal, ChevronDown, X
} from 'lucide-react';
import { roomAPI, compilerAPI } from '../services/api';
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
  const [showChat, setShowChat] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [joined, setJoined] = useState(false);
  const [leavingRoom, setLeavingRoom] = useState(false);
  const [endingRoom, setEndingRoom] = useState(false);
  
  // Compiler states
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [executionError, setExecutionError] = useState(null);
  const [stdin, setStdin] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const codeEditorRef = useRef(null);
  const chatEndRef = useRef(null);
  const hasJoinedRef = useRef(false);
  const outputRef = useRef(null);

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

  const fetchSupportedLanguages = async () => {
    try {
      const response = await compilerAPI.getSupportedLanguages();
      setSupportedLanguages(response.languages);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  useEffect(() => {
    fetchRoom();
    fetchSupportedLanguages();
    
    return () => {
      // Cleanup when component unmounts
      if (hasJoinedRef.current && roomId) {
        leaveRoom(roomId);
        hasJoinedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          
          // Load saved code from database
          if (response.code) {
            setCode(response.code);
          }
          
          // Load saved language
          if (response.language) {
            setSelectedLanguage(response.language);
          }
          
          // Load saved messages from database
          if (response.messages && response.messages.length > 0) {
            const formattedMessages = response.messages.map(msg => ({
              userId: msg.user,
              username: msg.username,
              message: msg.message,
              type: msg.type || 'message',
              timestamp: msg.timestamp
            }));
            setMessages(formattedMessages);
          }
          
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (data.language) {
        setSelectedLanguage(data.language);
      }
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
  }, [socket, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (connected) {
      sendCodeChange(roomId, newCode, selectedLanguage);
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

  const handleRunCode = async () => {
    if (!code.trim()) {
      alert('Please write some code first!');
      return;
    }

    setIsExecuting(true);
    setShowOutput(true);
    setOutput('Executing code...\n');
    setExecutionError(null);

    try {
      const result = await compilerAPI.executeCode(code, selectedLanguage, stdin);
      
      if (result.success) {
        const { output: codeOutput, statusCode, memory, cpuTime, error } = result.result;
        
        let formattedOutput = '';
        
        if (error) {
          formattedOutput = `❌ Error:\n${error}\n`;
          setExecutionError(error);
        } else {
          formattedOutput = `✅ Execution Successful\n\n`;
          formattedOutput += `📤 Output:\n${codeOutput}\n\n`;
          formattedOutput += `📊 Stats:\n`;
          formattedOutput += `   • Status Code: ${statusCode}\n`;
          formattedOutput += `   • Memory: ${memory} bytes\n`;
          formattedOutput += `   • CPU Time: ${cpuTime}s\n`;
        }
        
        setOutput(formattedOutput);
      } else {
        setOutput(`❌ Execution Failed:\n${result.error || 'Unknown error'}`);
        setExecutionError(result.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to execute code';
      setOutput(`❌ Error:\n${errorMessage}`);
      setExecutionError(errorMessage);
    } finally {
      setIsExecuting(false);
    }
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
        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Code Editor */}
          <div className={`bg-white rounded-3xl shadow-xl border-4 border-gray-100 flex flex-col overflow-hidden transition-all ${
            showOutput ? 'h-1/2' : 'flex-1'
          }`}>
            <div className="flex items-center justify-between p-4 border-b-2 border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-pink-500" />
                  <span className="font-bold text-gray-800">Code Editor</span>
                </div>
                
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 rounded-xl font-semibold text-gray-700 hover:from-orange-200 hover:to-pink-200 transition"
                  >
                    <span className="capitalize">{selectedLanguage}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {showLanguageDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-2 z-50 max-h-64 overflow-y-auto w-48"
                      >
                        {supportedLanguages.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => {
                              setSelectedLanguage(lang.id);
                              setShowLanguageDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 transition capitalize ${
                              selectedLanguage === lang.id ? 'bg-gradient-to-r from-orange-100 to-pink-100 font-semibold' : ''
                            }`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Code
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            <textarea
              ref={codeEditorRef}
              value={code}
              onChange={handleCodeChange}
              className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none bg-gray-50"
              placeholder={`// Start coding in ${selectedLanguage}...\n`}
              spellCheck="false"
            />
          </div>

          {/* Output Panel */}
          <AnimatePresence>
            {showOutput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 flex-1 flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b-2 border-gray-100">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-gray-800">Output</span>
                  </div>
                  <button
                    onClick={() => setShowOutput(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Input Section */}
                <div className="px-6 py-3 border-b-2 border-gray-100">
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">Input (stdin):</label>
                  <input
                    type="text"
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                
                <div
                  ref={outputRef}
                  className="flex-1 p-6 font-mono text-sm bg-gray-900 text-green-400 overflow-y-auto whitespace-pre-wrap"
                >
                  {output || 'Click "Run Code" to see output...'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              <div className="p-4 border-t-2 border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder={connected ? "Type a message..." : "Connecting..."}
                    disabled={!connected}
                    className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
                  />
                  <motion.button
                    whileHover={{ scale: connected ? 1.05 : 1 }}
                    whileTap={{ scale: connected ? 0.95 : 1 }}
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!connected}
                    className="bg-gradient-to-r from-orange-400 to-pink-400 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoomEditor;
//hello