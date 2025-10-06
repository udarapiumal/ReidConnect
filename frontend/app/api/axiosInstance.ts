import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/config';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach Authorization header with Bearer token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('Token retrieved from storage:', token ? 'Token exists' : 'No token found');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set for request to:', config.url);
    } else {
      console.warn('No token available for request to:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
