import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: async (credentials) => {
    // Determine if input is email or username (FastAPI OAuth2 expects 'username')
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    return api.post('/auth/login', formData);
  },
};

export default api;
