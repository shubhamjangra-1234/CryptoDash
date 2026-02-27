import cryptoApi from './cryptoService';

// Get top cryptocurrencies by market cap
export const getTopCryptos = async (limit = 100, currency = 'usd') => {
  try {
    const response = await cryptoApi.get('/coins/markets', {
      params: {
        vs_currency: import.meta.env.VITE_CURRENCY || currency,
        order: import.meta.env.VITE_ORDER || 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: import.meta.env.VITE_SPARKLINE !== 'false',
        price_change_percentage: import.meta.env.VITE_PRICE_CHANGE_PERCENTAGE || '24h'
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    throw error;
  }
};

// Get cryptocurrency details by ID
export const getCryptoDetails = async (id, currency = 'usd') => {
  try {
    const response = await cryptoApi.get(`/coins/${id}`, {
      params: {
        localization: import.meta.env.VITE_LOCALIZATION !== 'false',
        tickers: import.meta.env.VITE_TICKERS !== 'false',
        market_data: import.meta.env.VITE_MARKET_DATA !== 'false',
        community_data: import.meta.env.VITE_COMMUNITY_DATA !== 'false',
        developer_data: import.meta.env.VITE_DEVELOPER_DATA !== 'false',
        sparkline: import.meta.env.VITE_SPARKLINE !== 'false'
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw error;
  }
};

// Search cryptocurrencies
export const searchCryptos = async (query) => {
  try {
    const response = await cryptoApi.get('/search', {
      params: { query }
    });
    return response;
  } catch (error) {
    console.error('Error searching cryptos:', error);
    throw error;
  }
};

// Get global market data
export const getGlobalMarketData = async () => {
  try {
    const response = await cryptoApi.get('/global');
    return response;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
};

// Get price history for a cryptocurrency
export const getPriceHistory = async (id, days = 7, currency = 'usd') => {
  try {
    const response = await cryptoApi.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: import.meta.env.VITE_CURRENCY || currency,
        days: days,
        interval: days === 1 ? 'hourly' : 'daily'
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};

export default {
  getTopCryptos,
  getCryptoDetails,
  searchCryptos,
  getGlobalMarketData,
  getPriceHistory
};
