import { useQuery, useMutation } from '@tanstack/react-query';
import { DASHBOARD_CONFIG } from '../constants';
import { useMemo } from 'react';
import { useCryptoStats } from '../../crypto';

// Hook for market statistics - using real crypto service
export const useMarketStats = () => {
  const { globalData, isLoading, error } = useCryptoStats();
  
  // Transform API data to match our component expectations
  const transformedData = {
    totalMarketCap: globalData?.totalMarketCap?.usd || 0,
    marketCapChange: globalData?.marketCapChangePercentage24hUsd || 0,
    totalVolume: globalData?.totalVolume?.usd || 0,
    volumeChange: globalData?.volumeChangePercentage24hUsd || 0,
    btcDominance: globalData?.marketCapPercentage?.btc || 0,
    btcDominanceChange: 0, // API doesn't provide this
    activeCryptos: globalData?.activeCryptocurrencies || 0,
    activeCryptosChange: 0 // API doesn't provide this
  };

  return {
    data: transformedData,
    isLoading,
    error
  };
};

// Hook for top movers - using real crypto service
export const useTopMovers = () => {
  const { topMarkets, isLoading, error } = useCryptoStats();
  
  // Transform markets data to gainers/losers
  const gainers = topMarkets?.filter(coin => (coin.priceChangePercentage24h || 0) > 0).slice(0, 5) || [];
  const losers = topMarkets?.filter(coin => (coin.priceChangePercentage24h || 0) < 0).slice(0, 5) || [];
  
  // Transform data structure
  const transformCoin = (coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.currentPrice,
    change: coin.priceChangePercentage24h,
    changeType: (coin.priceChangePercentage24h || 0) > 0 ? 'positive' : 'negative',
    marketCap: coin.marketCap,
    volume: coin.totalVolume,
    image: coin.image,
    rank: coin.marketCapRank
  });

  return {
    data: {
      gainers: gainers.map(transformCoin),
      losers: losers.map(transformCoin)
    },
    isLoading,
    error
  };
};

// Hook for market data table - using real crypto service
export const useMarketDataTable = (config = {}) => {
  const { topMarkets, isLoading, error } = useCryptoStats();
  
  // Transform data to match table structure and sort by rank ascending
  const processedData = useMemo(() => {
    if (!topMarkets) return [];
    
    // Transform data to match table structure
    const transformedData = topMarkets.map((coin, index) => ({
      id: coin.id,
      rank: coin.marketCapRank || index + 1,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.currentPrice,
      change: coin.priceChangePercentage24h,
      changeType: (coin.priceChangePercentage24h || 0) > 0 ? 'positive' : 'negative',
      marketCap: coin.marketCap,
      volume: coin.totalVolume,
      image: coin.image,
      sparkline: (coin.priceChangePercentage24h || 0) > 0 ? 'up' : 'down'
    }));

    // Sort by rank ascending (1, 2, 3, 4, 5...)
    return transformedData.sort((a, b) => a.rank - b.rank);
  }, [topMarkets]);

  return {
    data: processedData,
    isLoading,
    error
  };
};

// Hook for chart data - using real crypto service
export const useChartData = (timeRange = DASHBOARD_CONFIG.CHART_TIME_RANGE) => {
  // For now, return mock chart data - can be enhanced later
  return useQuery({
    queryKey: ['chartData', timeRange],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
          {
            label: 'Market Cap',
            data: [2.45, 2.48, 2.47, 2.50, 2.52, 2.50],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          }
        ]
      };
    },
    staleTime: DASHBOARD_CONFIG.CACHE_DURATION,
    refetchInterval: DASHBOARD_CONFIG.AUTO_REFRESH_INTERVAL,
    retry: DASHBOARD_CONFIG.MAX_RETRIES
  });
};

// Hook for data export
export const useDataExport = () => {
  return useMutation({
    mutationFn: async (data) => {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, filename: 'dashboard-export.csv' };
    },
    retry: DASHBOARD_CONFIG.MAX_ERROR_RETRIES
  });
};
