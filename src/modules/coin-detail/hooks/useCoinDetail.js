import { useQuery } from '@tanstack/react-query';
import { cryptoService } from '../../crypto/services/cryptoService';
import { useMemo } from 'react';

export const useCoinDetails = (coinId) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: () => cryptoService.getCoinDetails(coinId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const normalizedData = useMemo(() => {
    if (!data) return null;

    return {
      // Basic identity
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      image: data.image?.large || data.image?.small || '/placeholder-coin.png',
      rank: data.market_cap_rank || 0,
      
      // Additional identity fields
      web_slug: data.web_slug,
      asset_platform_id: data.asset_platform_id,
      block_time_in_minutes: data.block_time_in_minutes,
      hashing_algorithm: data.hashing_algorithm,
      country_origin: data.country_origin,
      genesis_date: data.genesis_date,
      contract_address: data.contract_address,
      preview_listing: data.preview_listing || false,
      
      // Price data
      currentPrice: data.market_data?.current_price?.usd || 0,
      priceChange24h: data.market_data?.price_change_percentage_24h || 0,
      
      // Multi-timeframe performance (direct fields)
      priceChange1h: data.market_data?.price_change_percentage_1h_in_currency?.usd || 0,
      priceChange7d: data.market_data?.price_change_percentage_7d || 0,
      priceChange14d: data.market_data?.price_change_percentage_14d || 0,
      priceChange30d: data.market_data?.price_change_percentage_30d || 0,
      priceChange200d: data.market_data?.price_change_percentage_200d || 0,
      priceChange1y: data.market_data?.price_change_percentage_1y || 0,
      
      // Multi-currency performance (from nested object)
      priceChange24hUSD: data.market_data?.price_change_24h_in_currency?.usd || 0,
      priceChange24hINR: data.market_data?.price_change_24h_in_currency?.inr || 0,
      priceChange24hEUR: data.market_data?.price_change_24h_in_currency?.eur || 0,
      priceChange24hBTC: data.market_data?.price_change_24h_in_currency?.btc || 0,
      priceChange24hETH: data.market_data?.price_change_24h_in_currency?.eth || 0,
      
      // Market metrics - return full market_data object for currency flexibility
      marketData: data.market_data || {},
      
      // Keep some flat fields for backward compatibility
      currentPrice: data.market_data?.current_price?.usd || 0,
      marketCap: data.market_data?.market_cap?.usd || 0,
      totalVolume: data.market_data?.total_volume?.usd || 0,
      high24h: data.market_data?.high_24h?.usd || 0,
      low24h: data.market_data?.low_24h?.usd || 0,
      
      // Supply metrics
      circulatingSupply: data.market_data?.circulating_supply || 0,
      totalSupply: data.market_data?.total_supply || 0,
      maxSupply: data.market_data?.max_supply || 0,
      max_supply_infinite: data.market_data?.max_supply_infinite || false,
      
      // Price history (direct objects)
      ath: data.market_data?.ath?.usd || 0,
      atl: data.market_data?.atl?.usd || 0,
      ath_date: data.market_data?.ath_date?.usd || null,
      atl_date: data.market_data?.atl_date?.usd || null,
      ath_change_percentage: data.market_data?.ath_change_percentage?.usd || 0,
      atl_change_percentage: data.market_data?.atl_change_percentage?.usd || 0,
      
      // Additional metrics
      market_cap_fdv_ratio: data.market_cap_fdv_ratio || 0,
      sentiment_votes_up_percentage: data.sentiment_votes_up_percentage || 0,
      sentiment_votes_down_percentage: data.sentiment_votes_down_percentage || 0,
      watchlist_portfolio_users: data.watchlist_portfolio_users || 0,
      market_cap_rank: data.market_cap_rank || 0,
      market_cap_rank_with_rehypothecated: data.market_cap_rank_with_rehypothecated || 0,
      
      // Categories and description
      categories: data.categories || [],
      description: data.description?.en || '',
      
      // Platforms and links
      platforms: data.platforms || {},
      detail_platforms: data.detail_platforms || {},
      links: {
        homepage: data.links?.homepage || [],
        blockchainSite: data.links?.blockchain_site || [],
        twitterScreenName: data.links?.twitter_screen_name,
        facebookUsername: data.links?.facebook_username,
        redditUrl: data.links?.subreddit_url,
        repos_url: data.links?.repos_url || {},
        whitepaper: data.links?.whitepaper,
        official_forum_url: data.links?.official_forum_url || [],
        chat_url: data.links?.chat_url || [],
        announcement_url: data.links?.announcement_url || [],
        snapshot_url: data.links?.snapshot_url,
        bitcointalk_thread_identifier: data.links?.bitcointalk_thread_identifier,
        telegram_channel_identifier: data.links?.telegram_channel_identifier
      },
      
      // Public notice and status
      public_notice: data.public_notice || null,
      additional_notices: data.additional_notices || [],
      status_updates: data.status_updates || [],
      last_updated: data.last_updated || null
    };
  }, [data]);

  return {
    data: normalizedData,
    isLoading,
    error
  };
};

export const useCoinMarketChart = (coinId, days = 7, currency = 'usd') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coinMarketChart', coinId, days, currency],
    queryFn: () => cryptoService.getMarketChart(coinId, days, currency),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });

  return {
    data: data || [],
    isLoading,
    error
  };
};
