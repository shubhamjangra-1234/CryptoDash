import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cryptoService } from '../services/cryptoService';

// Advanced query configuration constants
const QUERY_CONFIG = {
  MARKETS: {
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    refetchInterval: 120000, // 2 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  COIN_DETAILS: {
    staleTime: 60000, // 1 minute
    gcTime: 600000, // 10 minutes
    refetchInterval: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  MARKET_CHART: {
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    refetchInterval: 60000, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  },
  GLOBAL_DATA: {
    staleTime: 300000, // 5 minutes
    gcTime: 1800000, // 30 minutes
    refetchInterval: 600000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  SEARCH: {
    staleTime: 180000, // 3 minutes
    gcTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  },
  CATEGORIES: {
    staleTime: 3600000, // 1 hour
    gcTime: 7200000, // 2 hours
    refetchInterval: 3600000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  },
  EXCHANGES: {
    staleTime: 300000, // 5 minutes
    gcTime: 900000, // 15 minutes
    refetchInterval: 600000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  }
};

// Hook for fetching markets data with advanced optimization
export const useMarkets = (params = {}) => {
  return useQuery({
    queryKey: ['markets', params],
    queryFn: () => cryptoService.getMarkets(params),
    ...QUERY_CONFIG.MARKETS,
    select: (data) => {
      return data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        currentPrice: coin.current_price,
        marketCap: coin.market_cap,
        marketCapRank: coin.market_cap_rank,
        fullyDilutedValuation: coin.fully_diluted_valuation,
        totalVolume: coin.total_volume,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
        priceChange24h: coin.price_change_24h,
        priceChangePercentage24h: coin.price_change_percentage_24h,
        marketCapChange24h: coin.market_cap_change_24h,
        marketCapChangePercentage24h: coin.market_cap_change_percentage_24h,
        circulatingSupply: coin.circulating_supply,
        totalSupply: coin.total_supply,
        maxSupply: coin.max_supply,
        ath: coin.ath,
        athChangePercentage: coin.ath_change_percentage,
        athDate: coin.ath_date,
        atl: coin.atl,
        atlChangePercentage: coin.atl_change_percentage,
        atlDate: coin.atl_date,
        lastUpdated: coin.last_updated,
        sparkline: coin.sparkline_in_7d
      }));
    }
  });
};

// Hook for fetching coin details with optimized caching
export const useCoinDetails = (id, currency = 'usd') => {
  return useQuery({
    queryKey: ['coinDetails', id, currency],
    queryFn: () => cryptoService.getCoinDetails(id, currency),
    enabled: !!id,
    ...QUERY_CONFIG.COIN_DETAILS,
    select: (data) => ({
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      description: data.description.en,
      image: data.image.large,
      categories: data.categories,
      marketData: {
        currentPrice: data.market_data?.current_price[currency],
        marketCap: data.market_data?.market_cap[currency],
        marketCapRank: data.market_data?.market_cap_rank,
        fullyDilutedValuation: data.market_data?.fully_diluted_valuation[currency],
        totalVolume: data.market_data?.total_volume[currency],
        high24h: data.market_data?.high_24h[currency],
        low24h: data.market_data?.low_24h[currency],
        priceChange24h: data.market_data?.price_change_24h_in_currency[currency],
        priceChangePercentage24h: data.market_data?.price_change_percentage_24h,
        marketCapChange24h: data.market_data?.market_cap_change_24h_in_currency[currency],
        marketCapChangePercentage24h: data.market_data?.market_cap_change_percentage_24h,
        circulatingSupply: data.market_data?.circulating_supply,
        totalSupply: data.market_data?.total_supply,
        maxSupply: data.market_data?.max_supply,
        ath: data.market_data?.ath[currency],
        athChangePercentage: data.market_data?.ath_change_percentage[currency],
        athDate: data.market_data?.ath_date[currency],
        atl: data.market_data?.atl[currency],
        atlChangePercentage: data.market_data?.atl_change_percentage[currency],
        atlDate: data.market_data?.atl_date[currency],
        lastUpdated: data.market_data?.last_updated
      },
      links: {
        homepage: data.links.homepage,
        blockchainSite: data.links.blockchain_site,
        officialForumUrl: data.links.official_forum_url,
        chatUrl: data.links.chat_url,
        announcementUrl: data.links.announcement_url,
        twitterScreenName: data.links.twitter_screen_name,
        facebookUsername: data.links.facebook_username,
        telegramChannelIdentifier: data.links.telegram_channel_identifier,
        subredditUrl: data.links.subreddit_url,
        reposUrl: data.links.repos_url
      }
    })
  });
};

// Hook for fetching market chart with real-time updates
export const useMarketChart = (id, days = 7, currency = 'usd') => {
  return useQuery({
    queryKey: ['marketChart', id, days, currency],
    queryFn: () => cryptoService.getMarketChart(id, days, currency),
    enabled: !!id,
    ...QUERY_CONFIG.MARKET_CHART,
    select: (data) => ({
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
    })
  });
};

// Hook for global market data with optimized caching
export const useGlobalData = () => {
  return useQuery({
    queryKey: ['globalData'],
    queryFn: cryptoService.getGlobalData,
    ...QUERY_CONFIG.GLOBAL_DATA,
    select: (data) => ({
      activeCryptocurrencies: data.data.active_cryptocurrencies,
      upcomingIcos: data.data.upcoming_icos,
      ongoingIcos: data.data.ongoing_icos,
      endedIcos: data.data.ended_cos,
      markets: data.data.markets,
      totalMarketCap: data.data.total_market_cap,
      totalVolume: data.data.total_volume,
      marketCapPercentage: data.data.market_cap_percentage,
      marketCapChangePercentage24hUsd: data.data.market_cap_change_percentage_24h_usd,
      volumeChangePercentage24hUsd: data.data.volume_change_percentage_24h_usd,
      marketCapYtdPercentage: data.data.market_cap_ytd_percentage,
      volumeYtdPercentage: data.data.volume_ytd_percentage,
      marketCapAthPercentage: data.data.market_cap_ath_percentage,
      volumeAthPercentage: data.data.volume_ath_percentage,
      lastUpdated: data.data.updated_at
    })
  });
};

// Hook for searching coins with debounced optimization
export const useSearch = (query) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => cryptoService.searchCoins(query),
    enabled: !!query && query.length >= 2,
    ...QUERY_CONFIG.SEARCH,
    select: (data) => ({
      coins: data.coins?.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        marketCapRank: coin.market_cap_rank,
        thumb: coin.thumb,
        large: coin.large
      })) || [],
      exchanges: data.exchanges?.map(exchange => ({
        id: exchange.id,
        name: exchange.name,
        marketCapRank: exchange.market_cap_rank,
        thumb: exchange.thumb,
        large: exchange.large
      })) || [],
      categories: data.categories?.map(category => ({
        id: category.id,
        name: category.name
      })) || []
    })
  });
};

// Hook for categories with long-term caching
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: cryptoService.getCategories,
    ...QUERY_CONFIG.CATEGORIES,
    select: (data) => data.map(category => ({
      id: category.id,
      name: category.name,
      marketCap: category.market_cap,
      marketCapChange24h: category.market_cap_change_24h,
      volume24h: category.volume_24h,
      volumeChange24h: category.volume_change_24h,
      content: category.content,
      top3Coins: category.top_3_coins,
      marketCapUsd: category.market_cap_usd,
      volume24hUsd: category.volume_24h_usd
    }))
  });
};

// Hook for exchanges with optimized caching
export const useExchanges = (params = {}) => {
  return useQuery({
    queryKey: ['exchanges', params],
    queryFn: () => cryptoService.getExchanges(params),
    ...QUERY_CONFIG.EXCHANGES,
    select: (data) => data.map(exchange => ({
      id: exchange.id,
      name: exchange.name,
      yearEstablished: exchange.year_established,
      country: exchange.country,
      description: exchange.description,
      url: exchange.url,
      image: exchange.image,
      hasTradingIncentive: exchange.has_trading_incentive,
      trustScore: exchange.trust_score,
      trustScoreRank: exchange.trust_score_rank,
      tradeVolume24hBtc: exchange.trade_volume_24h_btc_normalized,
      tradeVolume24hBtcNormalized: exchange.trade_volume_24h_btc_normalized
    }))
  });
};

// Hook for crypto statistics with optimized queries
export const useCryptoStats = () => {
  const { data: globalData } = useGlobalData();
  const { data: markets } = useMarkets({ per_page: 10 });

  return {
    globalData,
    topMarkets: markets,
    // Calculate additional stats
    totalMarketCap: globalData?.totalMarketCap?.usd,
    marketCapChange: globalData?.marketCapChangePercentage24hUsd,
    totalVolume: globalData?.totalVolume?.usd,
    btcDominance: globalData?.marketCapPercentage?.btc,
    ethDominance: globalData?.marketCapPercentage?.eth,
    activeCryptos: globalData?.activeCryptocurrencies,
    topGainers: markets?.sort((a, b) => (b.priceChangePercentage24h || 0) - (a.priceChangePercentage24h || 0)).slice(0, 5),
    topLosers: markets?.sort((a, b) => (a.priceChangePercentage24h || 0) - (b.priceChangePercentage24h || 0)).slice(0, 5)
  };
};

export const useTopCryptos = (limit = 10, currency = 'usd') => {
  return useMarkets({
    per_page: limit,
    vs_currency: currency,
    order: 'market_cap_desc',
  });
};

// Prefetch hook for important routes
export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  const prefetchCoinDetails = (id, currency = 'usd') => {
    queryClient.prefetchQuery({
      queryKey: ['coinDetails', id, currency],
      queryFn: () => cryptoService.getCoinDetails(id, currency),
      ...QUERY_CONFIG.COIN_DETAILS,
    });
  };

  const prefetchMarketChart = (id, days = 7, currency = 'usd') => {
    queryClient.prefetchQuery({
      queryKey: ['marketChart', id, days, currency],
      queryFn: () => cryptoService.getMarketChart(id, days, currency),
      ...QUERY_CONFIG.MARKET_CHART,
    });
  };

  const prefetchGlobalData = () => {
    queryClient.prefetchQuery({
      queryKey: ['globalData'],
      queryFn: cryptoService.getGlobalData,
      ...QUERY_CONFIG.GLOBAL_DATA,
    });
  };

  return {
    prefetchCoinDetails,
    prefetchMarketChart,
    prefetchGlobalData,
  };
};

// Hook for invalidating queries when needed
export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateMarkets = () => {
    queryClient.invalidateQueries({ queryKey: ['markets'] });
  };

  const invalidateCoinDetails = (id, currency) => {
    queryClient.invalidateQueries({ queryKey: ['coinDetails', id, currency] });
  };

  const invalidateMarketChart = (id, days, currency) => {
    queryClient.invalidateQueries({ queryKey: ['marketChart', id, days, currency] });
  };

  const invalidateGlobalData = () => {
    queryClient.invalidateQueries({ queryKey: ['globalData'] });
  };

  return {
    invalidateMarkets,
    invalidateCoinDetails,
    invalidateMarketChart,
    invalidateGlobalData,
  };
};
