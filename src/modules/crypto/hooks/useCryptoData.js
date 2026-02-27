import { useQuery } from '@tanstack/react-query';
import { getTopCryptos, getCryptoDetails, searchCryptos, getGlobalMarketData, getPriceHistory } from '../services';

// Hook for fetching top cryptocurrencies
export const useTopCryptos = (limit = 100, sortBy = 'market_cap_desc') => {
  return useQuery({
    queryKey: ['topCryptos', limit, sortBy],
    queryFn: () => getTopCryptos(limit, import.meta.env.VITE_CURRENCY || 'usd', sortBy),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
    select: (data) => {
      // Sort data based on sortBy parameter
      const sortedData = [...data];
      
      switch (sortBy) {
        case 'market_cap_desc':
          return sortedData.sort((a, b) => b.market_cap - a.market_cap);
        case 'market_cap_asc':
          return sortedData.sort((a, b) => a.market_cap - b.market_cap);
        case 'price_desc':
          return sortedData.sort((a, b) => b.current_price - a.current_price);
        case 'price_asc':
          return sortedData.sort((a, b) => a.current_price - b.current_price);
        case 'volume_desc':
          return sortedData.sort((a, b) => b.total_volume - a.total_volume);
        case 'volume_asc':
          return sortedData.sort((a, b) => a.total_volume - b.total_volume);
        case 'change_desc':
          return sortedData.sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
        case 'change_asc':
          return sortedData.sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0));
        default:
          return sortedData;
      }
    }
  });
};

// Hook for fetching cryptocurrency details
export const useCryptoDetails = (id, currency = 'usd') => {
  return useQuery({
    queryKey: ['cryptoDetails', id, currency],
    queryFn: () => getCryptoDetails(id, import.meta.env.VITE_CURRENCY || currency),
    enabled: !!id,
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // 10 minutes
  });
};

// Hook for searching cryptocurrencies
export const useSearchCryptos = (query) => {
  return useQuery({
    queryKey: ['searchCryptos', query],
    queryFn: () => searchCryptos(query),
    enabled: !!query && query.length >= 2,
    staleTime: 300000, // 5 minutes
    select: (data) => data || []
  });
};

// Hook for global market data
export const useGlobalMarketData = () => {
  return useQuery({
    queryKey: ['globalMarketData'],
    queryFn: getGlobalMarketData,
    staleTime: 600000, // 10 minutes
    refetchInterval: 600000, // 10 minutes
  });
};

// Hook for price history
export const usePriceHistory = (id, days = 7) => {
  return useQuery({
    queryKey: ['priceHistory', id, days],
    queryFn: () => getPriceHistory(id, days, import.meta.env.VITE_CURRENCY || 'usd'),
    enabled: !!id, // Only run when id exists
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
    select: (data) => {
      // Transform data for chart usage
      return {
        prices: data.prices.map(([timestamp, price]) => ({
          timestamp,
          price,
          date: new Date(timestamp)
        })),
        marketCaps: data.market_caps.map(([timestamp, marketCap]) => ({
          timestamp,
          marketCap,
          date: new Date(timestamp)
        })),
        totalVolumes: data.total_volumes.map(([timestamp, volume]) => ({
          timestamp,
          volume,
          date: new Date(timestamp)
        }))
      };
    }
  });
};

// Hook for crypto statistics
export const useCryptoStats = () => {
  const { data: globalData } = useGlobalMarketData();
  const { data: topCryptos } = useTopCryptos(10);

  return {
    globalData,
    topCryptos,
    // Calculate additional stats
    totalMarketCap: globalData?.data?.total_market_cap?.usd,
    marketCapChange: globalData?.data?.market_cap_change_percentage_24h_usd,
    totalVolume: globalData?.data?.total_volume?.usd,
    btcDominance: globalData?.data?.market_cap_percentage?.btc,
    activeCryptos: globalData?.data?.active_cryptocurrencies
  };
};
