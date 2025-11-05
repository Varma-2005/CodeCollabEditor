import { motion } from 'framer-motion';
import { LogOut, User, Mail, Calendar, Code2, FileCode, Users, Settings, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const stats = [
    { icon: FileCode, label: 'Projects', value: '0', color: 'from-cyan-400 to-blue-400', emoji: '📁' },
    { icon: Users, label: 'Collaborators', value: '0', color: 'from-pink-400 to-purple-400', emoji: '👥' },
    { icon: Code2, label: 'Code Files', value: '0', color: 'from-green-400 to-emerald-400', emoji: '📄' },
  ];

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-2xl shadow-lg`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-2xl">{stat.emoji}</span>
                </motion.div>
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{stat.value}</span>
              </div>
              <p className="text-gray-700 text-sm sm:text-base font-semibold">{stat.label}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>+0% from last week</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-gray-100 mb-6 sm:mb-8"
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-gray-100"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Recent Activity</h3>
          <div className="text-center py-12">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              📅
            </motion.div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">No recent activity yet</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">Start coding to see your activity here! ✨</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
