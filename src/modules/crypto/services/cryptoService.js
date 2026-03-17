import axios from 'axios';
import { delay, withRetry, withCache, generateCacheKey } from '../../../utils/apiUtils';
import { errorHandler, retryWithBackoff } from '../../../utils/errorHandler';

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
    // Add request timestamp for debugging
    config.requestTimestamp = Date.now();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with centralized error handling
cryptoApi.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development') {
      const responseTime = Date.now() - response.config.requestTimestamp;
    }
    return response.data;
  },
  (error) => {
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    // Handle specific error types
    const errorType = errorHandler.getErrorType(error);
    
    switch (errorType) {
      case errorHandler.ERROR_TYPES.RATE_LIMIT:
        // Don't show toast for rate limit errors here - let the retry mechanism handle it
        break;
      case errorHandler.ERROR_TYPES.NETWORK_ERROR:
        // Show network error toast
        errorHandler.showErrorToast(error);
        break;
      case errorHandler.ERROR_TYPES.NOT_FOUND:
        // Don't show toast for 404s - let components handle it
        break;
      default:
        // Show toast for other errors
        errorHandler.showErrorToast(error);
    }

    // Enhance error with type information
    error.errorType = errorType;
    return Promise.reject(error);
  }
);

// Enhanced API methods with retry and caching
export const cryptoService = {
  // Get markets data with retry and caching
  getMarkets: async (params = {}) => {
    const cacheKey = generateCacheKey('markets', Object.entries(params).map(([k, v]) => `${k}:${v}`));
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        const defaultParams = {
          vs_currency: import.meta.env.VITE_CURRENCY || 'usd',
          order: import.meta.env.VITE_ORDER || 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: import.meta.env.VITE_SPARKLINE !== 'false',
          price_change_percentage: import.meta.env.VITE_PRICE_CHANGE_PERCENTAGE || '24h'
        };
        
        await delay(100); // Rate limiting
        
        return await cryptoApi.get('/coins/markets', {
          params: { ...defaultParams, ...params }
        });
      });
    });
  },

  // Get coin details by ID with retry and caching
  getCoinDetails: async (id, currency = 'usd') => {
    const cacheKey = generateCacheKey('coin', id, currency);
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        await delay(100); // Rate limiting
        
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
      });
    });
  },

  // Get market chart for a coin with retry and caching
  getMarketChart: async (id, days = 7, currency = 'usd') => {
    const cacheKey = generateCacheKey('chart', id, days, currency);
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        await delay(100); // Rate limiting
        
        return await cryptoApi.get(`/coins/${id}/market_chart`, {
          params: {
            vs_currency: import.meta.env.VITE_CURRENCY || currency,
            days: days,
            interval: days === 1 ? 'hourly' : 'daily'
          }
        });
      });
    });
  },

  // Get coin market chart data with retry and caching
  getCoinMarketChart: async (coinId, currency = 'usd', days = 7) => {
    const cacheKey = generateCacheKey('coinChart', coinId, days, currency);
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        await delay(100); // Rate limiting
        
        return await cryptoApi.get(`/coins/${coinId}/market_chart`, {
          params: {
            vs_currency: currency,
            days: days,
            interval: days === 1 ? 'hourly' : 'daily'
          }
        });
      });
    });
  },

  // Get global market data with retry and caching
  getGlobalData: async () => {
    const cacheKey = generateCacheKey('global');
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        await delay(100); // Rate limiting
        
        return await cryptoApi.get('/global');
      });
    });
  },

  // Search coins with retry and caching
  searchCoins: async (query) => {
    const cacheKey = generateCacheKey('search', query);
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        await delay(100); // Rate limiting
        
        return await cryptoApi.get('/search', {
          params: { query }
        });
      }, 2, 500); // Less retries for search
    });
  },

  // Get categories with retry and caching
  getCategories: async () => {
    const cacheKey = generateCacheKey('categories');
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        await delay(100); // Rate limiting
        
        return await cryptoApi.get('/coins/categories');
      });
    });
  },

  // Get exchanges with retry and caching
  getExchanges: async (params = {}) => {
    const cacheKey = generateCacheKey('exchanges', Object.entries(params).map(([k, v]) => `${k}:${v}`));
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        const defaultParams = {
          per_page: 100,
          page: 1
        };
        
        await delay(100); // Rate limiting
        
        return await cryptoApi.get('/exchanges', {
          params: { ...defaultParams, ...params }
        });
      });
    });
  },

  // Get exchange details with retry and caching
  getExchangeDetails: async (exchangeId) => {
    const cacheKey = generateCacheKey('exchange', exchangeId);
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        await delay(100); // Rate limiting
        
        return await cryptoApi.get(`/exchanges/${exchangeId}`);
      });
    });
  },

  // Get exchange markets with retry and caching
  getExchangeMarkets: async (exchangeId, params = {}) => {
    const cacheKey = generateCacheKey('exchangeMarkets', exchangeId, Object.entries(params).map(([k, v]) => `${k}:${v}`));
    
    return withCache(cacheKey, async () => {
      return retryWithBackoff(async () => {
        const defaultParams = {
          limit: 100,
          page: 1
        };
        
        await delay(100); // Rate limiting
        
        return await cryptoApi.get(`/exchanges/${exchangeId}/tickers`, {
          params: { ...defaultParams, ...params }
        });
      });
    });
  }
};

export default cryptoService;
