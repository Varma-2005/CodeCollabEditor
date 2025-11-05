import { motion } from 'framer-motion';
import { LogOut, User, Mail, Code2, FileCode, Users, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-cyan-50 relative overflow-hidden">
      {/* Playful floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-20 text-5xl opacity-30"
        >
          🎨
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-32 text-4xl opacity-30"
        >
          ⚡
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/3 text-5xl opacity-30"
        >
          ✨
        </motion.div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="bg-white/80 backdrop-blur-md shadow-sm border-b-4 border-gray-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 p-2 rounded-2xl shadow-lg">
                <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">CollabCodeEditor</h1>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 sm:px-4 rounded-full transition border-2 border-red-200 text-sm sm:text-base font-semibold shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-xl border-4 border-gray-100"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2 flex-wrap"
              >
                Welcome back, {user?.username}! 
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block text-3xl"
                >
                  👋
                </motion.span>
              </motion.h2>
              <p className="text-gray-600 text-sm sm:text-base">Ready to create something amazing? 🚀</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl transition border-2 border-gray-200 text-sm sm:text-base font-semibold shadow-md"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </motion.button>
          </div>

          {/* User Info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center gap-3 bg-gradient-to-br from-orange-100 to-pink-100 p-4 rounded-2xl border-2 border-orange-200 shadow-md"
            >
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <User className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Username</p>
                <p className="text-gray-800 font-bold text-sm sm:text-base">{user?.username}</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center gap-3 bg-gradient-to-br from-cyan-100 to-blue-100 p-4 rounded-2xl border-2 border-cyan-200 shadow-md"
            >
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Mail className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Email</p>
                <p className="text-gray-800 font-bold text-sm sm:text-base truncate">{user?.email}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-gray-100"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/rooms')}
              className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white font-bold py-4 px-6 rounded-full hover:from-orange-500 hover:to-purple-500 transition-all shadow-lg flex items-center gap-3 justify-center text-sm sm:text-base"
            >
              <FileCode className="w-5 h-5 sm:w-6 sm:h-6" />
              My Rooms 🎨
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/rooms')}
              className="bg-white text-gray-700 font-bold py-4 px-6 rounded-full transition shadow-lg border-2 border-gray-200 hover:border-pink-300 flex items-center gap-3 justify-center text-sm sm:text-base"
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              Join Room 👥
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
