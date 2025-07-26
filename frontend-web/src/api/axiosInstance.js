import axios from 'axios';

// Create base axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // your backend base URL
});

// Intercept each request before it is sent
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Get the token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach it to Authorization header
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // redirect to login
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
