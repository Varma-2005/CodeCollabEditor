const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const compilerRoutes = require('./routes/compilerRoutes');
const socketHandlers = require('./socket/socketHandlers');

// Load environment variables
dotenv.config();

// Verify critical environment variables on startup
console.log('🔍 Environment Variables Check:');
console.log('  DB_URL:', process.env.DB_URL ? '✅ Configured' : '❌ Missing');
console.log('  JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY ? '✅ Configured' : '❌ Missing');
console.log('  RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? `✅ ${process.env.RAPIDAPI_KEY.substring(0, 10)}...` : '❌ Missing');
console.log('  RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/compiler', compilerRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.IO handlers
socketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔌 Socket.IO server ready`);
});
