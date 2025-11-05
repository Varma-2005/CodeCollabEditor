import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  signin: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },
};

export const roomAPI = {
  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  getRoom: async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },
  getRoomByCode: async (roomCode) => {
    const response = await api.get(`/rooms/code/${roomCode}`);
    return response.data;
  },
  updateRoom: async (roomId, roomData) => {
    const response = await api.put(`/rooms/${roomId}`, roomData);
    return response.data;
  },
  deleteRoom: async (roomId) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  },
  joinRoom: async (roomId, password) => {
    const response = await api.post(`/rooms/${roomId}/join`, { password });
    return response.data;
  },
  leaveRoom: async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/leave`);
    return response.data;
  },
};

export default api;
