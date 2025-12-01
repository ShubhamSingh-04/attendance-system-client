import axios from 'axios';

// Base host for API calls. If VITE_API_BASE is provided it should be the origin
// (e.g. "http://localhost:5000"). We append `/api` so all requests go to
// <host>/api/...
export const API_HOST =
  import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const http = axios.create({
  baseURL: `${API_HOST}/api`,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
