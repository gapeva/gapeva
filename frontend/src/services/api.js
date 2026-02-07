import axios from 'axios';

// 1. Get URL from Environment
let API_URL = import.meta.env.VITE_API_URL;

// 2. Clean the URL: Remove trailing slash if present
if (API_URL && API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}

console.log("Connecting to Backend at:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Auth Token Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 4. Export Services
export const authService = {
  signup: (userData) => api.post('/api/v1/auth/signup', userData),

  login: async (credentials) => {
    return api.post('/api/v1/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
  },
};

export const userService = {
  // ✅ FIX: Changed from '/users/me' to '/auth/me'
  getProfile: () => api.get('/api/v1/auth/me'), 
  updateProfile: (data) => api.put('/api/v1/auth/me', data),
  updatePassword: (data) => api.put('/api/v1/auth/password', data),
};

export const walletService = {
  getWallets: () => api.get('/api/v1/wallets/'),
  createWallet: (walletData) => api.post('/api/v1/wallets/', walletData),
  validateDeposit: (data) => api.post('/api/v1/wallets/validate-deposit', data),
  verifyDeposit: (data) => api.post('/api/v1/wallets/verify-deposit', data),
  withdraw: (data) => api.post('/api/v1/wallets/withdraw', data),
  allocate: (data) => api.post('/api/v1/wallets/allocate', data),
  deallocate: (data) => api.post('/api/v1/wallets/deallocate', data),
  getHistory: () => api.get('/api/v1/wallets/history'),
};

export default api;