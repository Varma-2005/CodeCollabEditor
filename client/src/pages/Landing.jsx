import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Users, Zap, Shield, ArrowRight, CheckCircle, Github, Linkedin, Twitter } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Code2,
      title: 'Real-time Collaboration',
      description: 'Code together in real-time with your team members from anywhere in the world.',
      color: 'from-cyan-400 to-blue-400',
      emoji: '👥',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience blazing fast performance with our optimized infrastructure.',
      color: 'from-yellow-400 to-orange-400',
      emoji: '⚡',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your code is encrypted and secure. We take privacy seriously.',
      color: 'from-green-400 to-emerald-400',
      emoji: '🔒',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage your team, assign roles, and collaborate seamlessly.',
      color: 'from-pink-400 to-purple-400',
      emoji: '🎯',
    },
  ];

  const benefits = [
    'Real-time code synchronization',
    'Multiple programming languages',
    'Built-in chat and video calls',
    'Version control integration',
    'Code review tools',
    'Unlimited projects',
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-cyan-50 overflow-hidden relative">
      {/* Playful floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-6xl"
        >
          📚
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-20 text-5xl"
        >
          ✏️
        </motion.div>
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 left-1/4 text-4xl"
        >
          🐝
        </motion.div>
        <motion.div
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-40 right-1/3 text-5xl"
        >
          🍎
        </motion.div>
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-10 text-3xl"
        >
          🌿
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 bg-white/80 backdrop-blur-md shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <motion.div 
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 p-2 rounded-2xl shadow-lg">
                    <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">CollabCodeEditor</h1>
              </motion.div>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/signin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 hover:text-pink-600 transition text-sm sm:text-base font-medium"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow-lg text-sm sm:text-base"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <motion.span
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block text-6xl sm:text-8xl mb-4"
            >
              💻
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight"
          >
            The App That Makes
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Coding Fun!
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4 leading-relaxed"
          >
            Code together with your team in a delightful, collaborative environment. Built for developers who love creating amazing things! ✨
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 justify-center"
              >
                Start Coding Free 🚀
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg border-2 border-gray-200 hover:border-pink-300 transition"
            >
              Watch Demo 📹
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '10K+', label: 'Active Users', emoji: '👥' },
              { value: '50K+', label: 'Projects Created', emoji: '🎨' },
              { value: '99.9%', label: 'Uptime', emoji: '⚡' },
              { value: '24/7', label: 'Support', emoji: '💬' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border-2 border-gray-100"
              >
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">✨</span>
            Powerful Features
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to collaborate and build amazing projects together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-gray-100 group"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-4"
              >
                <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl w-fit shadow-lg`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 text-3xl">{feature.emoji}</span>
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-2xl border-4 border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Why Choose <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">CollabCodeEditor</span>?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700 text-sm sm:text-base font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 rounded-3xl p-6 sm:p-8 border-4 border-white shadow-lg"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl sm:text-9xl mb-6"
                >
                  🚀
                </motion.div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Ready to Start?</h3>
                <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                  Join thousands of developers already coding together and having fun! 🎉
                </p>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-bold shadow-lg w-full sm:w-auto"
                  >
                    Create Free Account ✨
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-md border-t-4 border-gray-100 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 p-2 rounded-2xl shadow-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-800 font-bold text-lg">CollabCodeEditor</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The ultimate platform for collaborative coding and team development. 💻✨
              </p>
            </div>

            <div>
              <h4 className="text-gray-800 font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition">Security</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-800 font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500 transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-800 font-bold mb-4">Connect</h4>
              <div className="flex gap-3">
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href="#"
                  className="bg-gray-100 p-3 rounded-2xl hover:bg-pink-100 transition shadow-md"
                >
                  <Github className="w-5 h-5 text-gray-700" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href="#"
                  className="bg-gray-100 p-3 rounded-2xl hover:bg-pink-100 transition shadow-md"
                >
                  <Twitter className="w-5 h-5 text-gray-700" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -3 }}
                  href="#"
                  className="bg-gray-100 p-3 rounded-2xl hover:bg-pink-100 transition shadow-md"
                >
                  <Linkedin className="w-5 h-5 text-gray-700" />
                </motion.a>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2024 CollabCodeEditor. All rights reserved. Made with 💜 by Bishop_Master</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;