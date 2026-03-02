import axios from 'axios';

// Axios instance for crypto API
const cryptoApi = axios.create({
  baseURL: import.meta.env.VITE_COINGECKO_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
});

// Request interceptor
cryptoApi.interceptors.request.use(
  (config) => {
    // Log request config for debugging
    console.log('Request config:', {
      baseURL: config.baseURL,
      url: config.url,
      headers: config.headers,
      method: config.method
    });
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

// API Methods
export const cryptoService = {
  // Get markets data
  getMarkets: async (params = {}) => {
    const defaultParams = {
      vs_currency: import.meta.env.VITE_CURRENCY || 'usd',
      order: import.meta.env.VITE_ORDER || 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: import.meta.env.VITE_SPARKLINE !== 'false',
      price_change_percentage: import.meta.env.VITE_PRICE_CHANGE_PERCENTAGE || '24h'
    };
    
    return await cryptoApi.get('/coins/markets', {
      params: { ...defaultParams, ...params }
    });
  },

  // Get coin details by ID
  getCoinDetails: async (id, currency = 'usd') => {
    return await cryptoApi.get(`/coins/${id}`, {
      params: {
        localization: import.meta.env.VITE_LOCALIZATION !== 'false',
        tickers: import.meta.env.VITE_TICKERS !== 'false',
        market_data: import.meta.env.VITE_MARKET_DATA !== 'false',
        community_data: import.meta.env.VITE_COMMUNITY_DATA !== 'false',
        developer_data: import.meta.env.VITE_DEVELOPER_DATA !== 'false',
        sparkline: import.meta.env.VITE_SPARKLINE !== 'false'
      }
    });
  },

  // Get market chart for a coin
  getMarketChart: async (id, days = 7, currency = 'usd') => {
    return await cryptoApi.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: import.meta.env.VITE_CURRENCY || currency,
        days: days,
        interval: days === 1 ? 'hourly' : 'daily'
      }
    });
  },

  // Get global market data
  getGlobalData: async () => {
    return await cryptoApi.get('/global');
  },

  // Search coins
  searchCoins: async (query) => {
    return await cryptoApi.get('/search', {
      params: { query }
    });
  },

  // Get categories
  getCategories: async () => {
    return await cryptoApi.get('/coins/categories');
  },

  // Get exchanges
  getExchanges: async (params = {}) => {
    const defaultParams = {
      per_page: 100,
      page: 1
    };
    
    return await cryptoApi.get('/exchanges', {
      params: { ...defaultParams, ...params }
    });
  }
};

export default cryptoService;
