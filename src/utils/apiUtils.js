// API utility functions for rate limiting and caching
const API_DELAY = 1000; // 1 second delay between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds between retries

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const withRetry = async (apiCall, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn(`Rate limit hit, retry ${i + 1}/${retries} in ${RETRY_DELAY}ms`);
        if (i === retries - 1) {
          throw error; // Final retry failed
        }
        await delay(RETRY_DELAY);
      } else {
        throw error; // Other errors, don't retry
      }
    }
  }
};

export const withCache = (key, apiCall) => {
  const cached = cache.get(key);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`Cache hit for ${key}`);
    return cached.data;
  }
  
  try {
    const result = await apiCall();
    cache.set(key, {
      data: result,
      timestamp: now
    });
    console.log(`Cache set for ${key}`);
    return result;
  } catch (error) {
    cache.delete(key); // Clear cache on error
    throw error;
  }
};

export const generateCacheKey = (prefix, ...params) => {
  return `${prefix}:${params.filter(Boolean).join(':')}`;
};

export const clearCache = () => {
  cache.clear();
  console.log('API cache cleared');
};
