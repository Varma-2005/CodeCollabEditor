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
    .populate('members.user', 'username email');

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.json({
    success: true,
    data: room
  });
}));

// @route   GET /api/rooms/code/:roomCode
// @desc    Get room by room code
// @access  Private
router.get('/code/:roomCode', protect, asyncHandler(async (req, res) => {
  const room = await Room.findOne({ roomCode: req.params.roomCode.toUpperCase() })
    .populate('creator', 'username email')
    .populate('members.user', 'username email');

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.json({
    success: true,
    data: room
  });
}));

// @route   PUT /api/rooms/:id
// @desc    Update room
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  // Check if user is the creator
  if (room.creator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this room');
  }

  const { name, description, maxMembers, isPrivate, password } = req.body;

  room.name = name || room.name;
  room.description = description !== undefined ? description : room.description;
  room.maxMembers = maxMembers || room.maxMembers;
  room.isPrivate = isPrivate !== undefined ? isPrivate : room.isPrivate;
  room.password = password !== undefined ? password : room.password;

  const updatedRoom = await room.save();
  const populatedRoom = await Room.findById(updatedRoom._id)
    .populate('creator', 'username email')
    .populate('members.user', 'username email');

  res.json({
    success: true,
    message: 'Room updated successfully',
    data: populatedRoom
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
