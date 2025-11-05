import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Users, Lock, Globe, Trash2, Edit, Copy, 
  LogOut, Code2, X, Check, Loader2 
} from 'lucide-react';
import { roomAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Rooms = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 10,
    isPrivate: false,
    password: ''
  });
  const [joinCode, setJoinCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');

    try {
      const response = await roomAPI.createRoom(formData);
      setRooms([response.data, ...rooms]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', maxMembers: 10, isPrivate: false, password: '' });
      navigate(`/room/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create room');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');

    try {
      const roomResponse = await roomAPI.getRoomByCode(joinCode);
      const room = roomResponse.data;
      
      await roomAPI.joinRoom(room._id, joinPassword);
      setShowJoinModal(false);
      setJoinCode('');
      setJoinPassword('');
      fetchRooms();
      navigate(`/room/${room._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join room');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await roomAPI.deleteRoom(roomId);
      setRooms(rooms.filter(r => r._id !== roomId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLeaveRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to leave this room?')) return;

    try {
      await roomAPI.leaveRoom(roomId);
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave room');
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.roomCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-cyan-50 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-32 left-20 text-5xl opacity-20"
        >
          🚀
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-32 right-32 text-4xl opacity-20"
        >
          💻
        </motion.div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b-4 border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 p-2 rounded-2xl shadow-lg">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                My Rooms
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { logout(); navigate('/signin'); }}
              className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-full transition font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Search and Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex-1 md:flex-none bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 justify-center shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Room
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowJoinModal(true)}
                className="flex-1 md:flex-none bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold flex items-center gap-2 justify-center hover:border-pink-300"
              >
                <Users className="w-5 h-5" />
                Join Room
              </motion.button>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 shadow-xl border-4 border-gray-100 text-center"
          >
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Rooms Found</h3>
            <p className="text-gray-600 mb-6">Create a new room or join an existing one to get started!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100 cursor-pointer"
                onClick={() => navigate(`/room/${room._id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{room.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{room.description || 'No description'}</p>
                  </div>
                  <div className="ml-2">
                    {room.isPrivate ? (
                      <Lock className="w-5 h-5 text-pink-500" />
                    ) : (
                      <Globe className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-orange-100 to-pink-100 px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-700">{room.roomCode}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); handleCopyCode(room.roomCode); }}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      {copiedCode === room.roomCode ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </motion.button>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{room.members.length}/{room.maxMembers}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>👤 {room.creator.username}</span>
                  {room.creator._id === user?.id && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Creator</span>}
                  {room.creator._id !== user?.id && <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold">Member</span>}
                  <span>•</span>
                  <span>🟢 {room.activeUsers?.length || 0} online</span>
                </div>

                {room.creator._id === user?.id ? (
                  <div className="flex gap-2 pt-4 border-t-2 border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); /* Edit modal */ }}
                      className="flex-1 bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 justify-center"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room._id); }}
                      className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                ) : (
                  <div className="pt-4 border-t-2 border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleLeaveRoom(room._id);
                      }}
                      className="w-full bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                      Leave Room
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Room</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-semibold">Room Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="My Awesome Room"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-semibold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    rows="3"
                    placeholder="What's this room about?"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-semibold">Max Members</label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="isPrivate" className="text-gray-700 font-semibold">Private Room</label>
                </div>

                {formData.isPrivate && (
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-semibold">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="Enter room password"
                    />
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white font-bold py-3 rounded-full disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  {createLoading ? 'Creating...' : 'Create Room'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Room Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Join Room</h2>
                <button onClick={() => setShowJoinModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-semibold">Room Code</label>
                  <input
                    type="text"
                    required
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 uppercase"
                    placeholder="ABC123"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-semibold">Password (if private)</label>
                  <input
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Enter password if required"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white font-bold py-3 rounded-full disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                  {createLoading ? 'Joining...' : 'Join Room'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rooms;
