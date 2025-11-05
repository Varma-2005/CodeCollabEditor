const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    minlength: [3, 'Room name must be at least 3 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  activeUsers: [{
    userId: mongoose.Schema.Types.ObjectId,
    socketId: String,
    username: String,
    joinedAt: Date
  }],
  // Store room code content
  code: {
    type: String,
    default: '// Start coding here...\n'
  },
  language: {
    type: String,
    default: 'javascript'
  },
  lastCodeUpdate: {
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    at: Date
  },
  // Store chat messages
  messages: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    type: {
      type: String,
      enum: ['message', 'system'],
      default: 'message'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Store code execution requests
  codeExecutionRequest: {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedByUsername: String,
    code: String,
    language: String,
    stdin: String,
    timestamp: Date,
    approvals: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String,
      approved: Boolean,
      timestamp: Date
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'executed'],
      default: 'pending'
    }
  },
  maxMembers: {
    type: Number,
    default: 10,
    min: 2,
    max: 50
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  password: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique room code
roomSchema.statics.generateRoomCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let exists = true;

  while (exists) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    exists = await this.findOne({ roomCode: code });
  }

  return code;
};

// Index for faster message queries
roomSchema.index({ 'messages.timestamp': -1 });

module.exports = mongoose.model('Room', roomSchema);
