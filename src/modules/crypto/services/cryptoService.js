import axios from 'axios';

// Axios instance for crypto API
const cryptoApi = axios.create({
  baseURL: import.meta.env.VITE_COINGECKO_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    ...(import.meta.env.VITE_COINGECKO_API_KEY && { 'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY })
  }
});

// Request interceptor
cryptoApi.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
cryptoApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (error.response?.status === 401) {
      throw new Error('Unauthorized access.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    throw error;
  }
);

export default cryptoApi;
