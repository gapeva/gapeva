import axios from 'axios';

// 1. Dynamic Base URL (Keeps your previous fix)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Auth Token Interceptor (Keeps user logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Auth Service with CORRECT PATHS
export const authService = {
  // FIX: Added '/api/v1' prefix to match backend/app/main.py
  signup: (userData) => api.post('/api/v1/auth/signup', userData),
  
  login: async (credentials) => {
    // FastAPI OAuth2 expects form data for login
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    // FIX: Added '/api/v1' prefix
    return api.post('/api/v1/auth/login', formData);
  },
};

// 4. Wallet Service (Adding this so your Dashboard works later)
export const walletService = {
  getWallets: () => api.get('/api/v1/wallets/'),
  createWallet: (walletData) => api.post('/api/v1/wallets/', walletData),
};

export default api;

