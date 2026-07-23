import axios from 'axios';

export const API_ORIGIN = window.location.hostname === 'localhost' ? '' : 'https://protfolio-backend-tf9i.onrender.com';

const api = axios.create({
  baseURL: API_ORIGIN + '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
