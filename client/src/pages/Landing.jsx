import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Users, Zap, Shield, ArrowRight, CheckCircle, Github, Linkedin, Twitter, Terminal } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Code2,
      title: 'Real-time Collaboration',
      description: 'Code together in real-time with your team members from anywhere in the world.',
      color: 'from-cyan-400 to-blue-400',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience blazing fast performance with our optimized infrastructure.',
      color: 'from-yellow-400 to-orange-400',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your code is encrypted and secure. We take privacy seriously.',
      color: 'from-green-400 to-emerald-400',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage your team, assign roles, and collaborate seamlessly.',
      color: 'from-pink-400 to-purple-400',
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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden relative">
      {/* Professional gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-to-br from-purple-300 to-cyan-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-20 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl"
        />
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
                  {/* New Logo Design */}
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                    {/* Animated glow */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 rounded-xl blur-md"
                    />
                    {/* Logo container */}
                    <div className="relative bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 rounded-xl p-2 shadow-lg">
                      <div className="relative">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-full h-full"
                        >
                          {/* Left bracket */}
                          <path
                            d="M8 6L4 12L8 18"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Right bracket */}
                          <path
                            d="M16 6L20 12L16 18"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Forward slash */}
                          <path
                            d="M14 4L10 20"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
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
          {/* Professional Hero Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              {/* Animated glow effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-full blur-3xl"
              />
              
              {/* Main icon container */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative bg-gradient-to-br from-white via-gray-50 to-white p-10 sm:p-12 rounded-full shadow-2xl border-4 border-white"
              >
                {/* Code editor window mockup */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                  {/* Terminal/Editor frame */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-inner overflow-hidden">
                    {/* Top bar */}
                    <div className="h-6 bg-gray-700 flex items-center px-3 gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    
                    {/* Code content */}
                    <div className="p-3 space-y-2 font-mono text-xs">
                      {/* Line 1 */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex items-center gap-1"
                      >
                        <span className="text-purple-400">const</span>
                        <span className="text-blue-300">code</span>
                        <span className="text-pink-400">=</span>
                      </motion.div>
                      
                      {/* Line 2 */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="pl-3"
                      >
                        <span className="text-green-400">"together"</span>
                      </motion.div>
                      
                      {/* Line 3 - Cursor */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="flex items-center"
                      >
                        <span className="text-gray-400">&lt;/&gt;</span>
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-1.5 h-3 bg-gradient-to-r from-orange-400 to-pink-400 ml-1"
                        ></motion.span>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Floating code symbols */}
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-400 to-pink-400 text-white font-bold text-xl w-10 h-10 rounded-xl shadow-lg flex items-center justify-center"
                  >
                    &lt;
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      y: [0, -12, 0],
                      rotate: [0, -10, 0]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-4 -left-4 bg-gradient-to-br from-pink-400 to-purple-400 text-white font-bold text-xl w-10 h-10 rounded-xl shadow-lg flex items-center justify-center"
                  >
                    &gt;
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 15, 0]
                    }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="absolute top-1/2 -right-6 bg-gradient-to-br from-purple-400 to-cyan-400 text-white font-bold text-lg w-8 h-8 rounded-lg shadow-lg flex items-center justify-center"
                  >
                    /
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight"
          >
            Code Together,
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Build Better
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4 leading-relaxed"
          >
            The ultimate collaborative code editor for teams. Write, review, and ship code together in real-time with powerful features designed for modern developers.
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
                Start Coding Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg border-2 border-gray-200 hover:border-pink-300 transition"
            >
              Watch Demo
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
              { value: '10K+', label: 'Active Users' },
              { value: '50K+', label: 'Projects Created' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-200"
              >
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
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
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative mb-4"
              >
                <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl w-fit shadow-lg`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-gray-200">
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
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
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
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl sm:text-7xl mb-6 font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                >
                  &lt;/&gt;
                </motion.div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Ready to Start?</h3>
                <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                  Join thousands of developers already coding together and building exceptional products.
                </p>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-bold shadow-lg w-full sm:w-auto"
                  >
                    Create Free Account
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-md border-t border-gray-200 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {/* Footer Logo */}
                <div className="relative w-8 h-8">
                  <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 rounded-xl p-1.5 shadow-lg">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-full h-full"
                    >
                      <path
                        d="M8 6L4 12L8 18"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 6L20 12L16 18"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 4L10 20"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-800 font-bold text-lg">CollabCodeEditor</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The ultimate platform for collaborative coding and team development.
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

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2025 CollabCodeEditor. All rights reserved. Made by Bishop_Master</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;