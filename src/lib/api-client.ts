import axios from 'axios';
import { authStorageKey } from '@/contexts/AuthContext';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(authStorageKey);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
