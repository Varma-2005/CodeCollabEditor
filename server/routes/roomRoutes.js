const express = require('express');
const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { name, description, maxMembers, isPrivate, password } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Room name is required');
  }

  // Generate unique room code
  const roomCode = await Room.generateRoomCode();

  const room = await Room.create({
    name,
    description,
    roomCode,
    creator: req.user._id,
    members: [{ user: req.user._id }],
    maxMembers: maxMembers || 10,
    isPrivate: isPrivate || false,
    password: password || undefined
  });

  const populatedRoom = await Room.findById(room._id)
    .populate('creator', 'username email')
    .populate('members.user', 'username email');

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: populatedRoom
  });
}));

// @route   GET /api/rooms
// @desc    Get all rooms (public or user's rooms)
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  console.log('🔍 Fetching rooms for user:', req.user._id);
  
  const rooms = await Room.find({
    $or: [
      { isPrivate: false },
      { creator: req.user._id },
      { 'members.user': req.user._id }
    ]
  })
    .populate('creator', 'username email')
    .populate('members.user', 'username email')
    .sort({ createdAt: -1 });

  console.log('📦 Found rooms:', rooms.length);

  res.json({
    success: true,
    data: rooms
  });
}));

// @route   GET /api/rooms/:id
// @desc    Get single room by ID
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id)
    .populate('creator', 'username email')
    .populate('members.user', 'username email')
    .populate('messages.user', 'username')
    .populate('lastCodeUpdate.by', 'username');

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.json({
    success: true,
    data: room
  });
}));

// @route   GET /api/rooms/:id/code
// @desc    Get room code
// @access  Private
router.get('/:id/code', protect, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).select('code language lastCodeUpdate');

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  // Check if user is a member
  const isMember = room.members.some(
    member => member.user.toString() === req.user._id.toString()
  );

  if (!isMember && room.creator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this room');
  }

  res.json({
    success: true,
    data: {
      code: room.code,
      language: room.language,
      lastUpdate: room.lastCodeUpdate
    }
  });
}));

// @route   GET /api/rooms/:id/messages
// @desc    Get room messages
// @access  Private
router.get('/:id/messages', protect, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const skip = parseInt(req.query.skip) || 0;

  const room = await Room.findById(req.params.id)
    .select('messages')
    .populate('messages.user', 'username');

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  // Get messages with pagination
  const messages = room.messages
    .slice(skip, skip + limit)
    .sort((a, b) => a.timestamp - b.timestamp);

  res.json({
    success: true,
    data: {
      messages,
      total: room.messages.length,
      hasMore: room.messages.length > skip + limit
    }
  });
}));

// @route   PUT /api/rooms/:id/code
// @desc    Update room code
// @access  Private
router.put('/:id/code', protect, asyncHandler(async (req, res) => {
  const { code, language } = req.body;

  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  // Check if user is a member
  const isMember = room.members.some(
    member => member.user.toString() === req.user._id.toString()
  );

  if (!isMember && room.creator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update code in this room');
  }

  room.code = code;
  room.language = language || room.language;
  room.lastCodeUpdate = {
    by: req.user._id,
    at: new Date()
  };

  await room.save();

  res.json({
    success: true,
    message: 'Code updated successfully',
    data: {
      code: room.code,
      language: room.language,
      lastUpdate: room.lastCodeUpdate
    }
  });
}));

// @route   DELETE /api/rooms/:id
// @desc    Delete room
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  // Check if user is the creator
  if (room.creator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this room');
  }

  await room.deleteOne();

  res.json({
    success: true,
    message: 'Room deleted successfully'
  });
}));

// @route   POST /api/rooms/:id/join
// @desc    Join a room
// @access  Private
router.post('/:id/join', protect, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  // Check if room is full
  if (room.members.length >= room.maxMembers) {
    res.status(400);
    throw new Error('Room is full');
  }

  // Check if user is already a member
  const isMember = room.members.some(
    member => member.user.toString() === req.user._id.toString()
  );

  if (isMember) {
    res.status(400);
    throw new Error('You are already a member of this room');
  }

  // Check password only if room is private
  if (room.isPrivate && room.password) {
    const { password } = req.body;
    if (!password || password !== room.password) {
      res.status(401);
      throw new Error('Incorrect password');
    }
  }

  room.members.push({ user: req.user._id });
  await room.save();

  const updatedRoom = await Room.findById(room._id)
    .populate('creator', 'username email')
    .populate('members.user', 'username email');

  res.json({
    success: true,
    message: 'Joined room successfully',
    data: updatedRoom
  });
}));

// @route   POST /api/rooms/:id/leave
// @desc    Leave a room
// @access  Private
router.post('/:id/leave', protect, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  // Creator cannot leave their own room
  if (room.creator.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Creator cannot leave the room. Delete the room instead.');
  }

  // Remove user from members
  room.members = room.members.filter(
    member => member.user.toString() !== req.user._id.toString()
  );

  await room.save();

  res.json({
    success: true,
    message: 'Left room successfully'
  });
}));

module.exports = router;
