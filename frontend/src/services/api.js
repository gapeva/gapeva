import axios from 'axios';

// 1. Dynamic Base URL
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

// 3. Auth Service with CORRECT PATHS (Added /api/v1)
export const authService = {
  signup: (userData) => api.post('/api/v1/auth/signup', userData),
  
  login: async (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    return api.post('/api/v1/auth/login', formData);
  },
};

// 4. Wallet Service (Added /api/v1)
export const walletService = {
  getWallets: () => api.get('/api/v1/wallets/'),
  createWallet: (walletData) => api.post('/api/v1/wallets/', walletData),
  validateDeposit: (data) => api.post('/api/v1/wallets/validate-deposit', data),
  verifyDeposit: (data) => api.post('/api/v1/wallets/verify-deposit', data),
  withdraw: (data) => api.post('/api/v1/wallets/withdraw', data),
  getHistory: () => api.get('/api/v1/wallets/history'),
};

export default api;
