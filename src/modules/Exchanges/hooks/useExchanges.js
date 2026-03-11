import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { cryptoService } from "../../crypto/services/cryptoService";

// Fetch exchanges from CoinGecko API
const fetchExchanges = async () => {
  try {
    const response = await cryptoService.getExchanges();
    return response;
  } catch (error) {
    console.error("Failed to fetch exchanges:", error);
    throw error;
  }
};

// Fetch detailed exchange data
const fetchExchangeDetails = async (exchangeId) => {
  try {
    const response = await cryptoService.getExchangeDetails(exchangeId);
    return response;
  } catch (error) {
    console.error("Failed to fetch exchange details:", error);
    throw error;
  }
};

export const useExchanges = () => {
  // Fetch exchanges data
  const {
    data: rawExchanges,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["exchanges"],
    queryFn: fetchExchanges,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Normalize exchanges data
  const exchanges = useMemo(() => {
    if (!rawExchanges || !Array.isArray(rawExchanges)) return [];

    return rawExchanges.map((exchange) => ({
      id: exchange.id || `exchange-${Math.random()}`,
      name: exchange.name || "Unknown Exchange",
      trust_score: exchange.trust_score || 0,
      trust_score_rank: exchange.trust_score_rank || null,
      trade_volume_24h_btc: exchange.trade_volume_24h_btc || 0,
      trade_volume_24h_btc_normalized: exchange.trade_volume_24h_btc_normalized || exchange.trade_volume_24h_btc || 0,
      year_established: exchange.year_established || null,
      country: exchange.country || "Unknown",
      description: exchange.description || "",
      url: exchange.url || "",
      image: exchange.image || "",
      has_trading_incentive: exchange.has_trading_incentive || false,
      centralized: exchange.centralized !== false, // Default to true
      public_notice: exchange.public_notice || "",
      alert_notice: exchange.alert_notice || "",
      twitter_handle: exchange.twitter_handle || "",
      facebook_url: exchange.facebook_url || "",
      telegram_url: exchange.telegram_url || "",
      reddit_url: exchange.reddit_url || "",
      slack_url: exchange.slack_url || "",
      other_url_1: exchange.other_url_1 || "",
      other_url_2: exchange.other_url_2 || "",
      other_url_3: exchange.other_url_3 || "",
      tickers: exchange.tickers || [],
      status: exchange.status || "active",
      formattedVolume: formatVolume(exchange.trade_volume_24h_btc_normalized * 50000), // Approximate USD conversion
      formattedTrustScore: formatTrustScore(exchange.trust_score),
      formattedStatus: formatStatus(exchange.status === "active"),
      countryFlag: getCountryFlag(exchange.country)
    }));
  }, [rawExchanges]);

  // Analytics calculation
  const analytics = useMemo(() => {
    if (!exchanges.length) {
      return {
        totalExchanges: 0,
        totalVolume: 0,
        averageTrustScore: 0,
        topExchange: null,
        exchangeDominance: [],
        countries: [],
        centralizedCount: 0,
        decentralizedCount: 0
      };
    }

    const totalVolume = exchanges.reduce(
      (sum, ex) => sum + (ex.trade_volume_24h_btc_normalized || 0),
      0
    );

    const totalTrustScore = exchanges.reduce(
      (sum, ex) => sum + (ex.trust_score || 0),
      0
    );

    const averageTrustScore = totalTrustScore / exchanges.length;

    // Find top exchange by volume
    const topExchange = exchanges.reduce((max, ex) => 
      (ex.trade_volume_24h_btc_normalized || 0) > (max?.trade_volume_24h_btc_normalized || 0) ? ex : max
    , null);

    // Calculate dominance for each exchange
    const exchangesWithDominance = exchanges.map(exchange => ({
      ...exchange,
      dominance: totalVolume > 0 ? (exchange.trade_volume_24h_btc_normalized / totalVolume) * 100 : 0
    }));

    // Get top exchanges by dominance
    const exchangeDominance = [...exchangesWithDominance]
      .sort((a, b) => b.trade_volume_24h_btc_normalized - a.trade_volume_24h_btc_normalized)
      .slice(0, 10);

    // Count exchanges by country
    const countries = exchanges.reduce((acc, exchange) => {
      const country = exchange.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    // Count centralized vs decentralized
    const centralizedCount = exchanges.filter(ex => ex.centralized).length;
    const decentralizedCount = exchanges.length - centralizedCount;

    return {
      totalExchanges: exchanges.length,
      totalVolume,
      averageTrustScore,
      topExchange,
      exchangeDominance,
      countries,
      centralizedCount,
      decentralizedCount
    };
  }, [exchanges]);

  // Final exchanges with formatting
  const finalExchanges = useMemo(() => {
    if (!exchanges.length) return [];

    return exchanges.map((exchange) => ({
      ...exchange,
      dominance: analytics.totalVolume > 0
        ? (exchange.trade_volume_24h_btc_normalized / analytics.totalVolume) * 100
        : 0,
      formattedVolume: formatVolume(exchange.trade_volume_24h_btc_normalized * 50000),
      formattedTrustScore: formatTrustScore(exchange.trust_score),
      formattedStatus: formatStatus(exchange.status === "active"),
      countryFlag: getCountryFlag(exchange.country)
    }));
  }, [exchanges, analytics.totalVolume]);

  return {
    exchanges: finalExchanges,
    analytics,
    isLoading,
    error,
    refetch
  };
};

export const useExchangeDetails = (exchangeId) => {
  const {
    data: exchangeDetails,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["exchangeDetails", exchangeId],
    queryFn: () => fetchExchangeDetails(exchangeId),
    enabled: !!exchangeId,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  const formattedExchangeDetails = useMemo(() => {
    if (!exchangeDetails) return null;

    return {
      ...exchangeDetails,
      formattedVolume: formatVolume(exchangeDetails.trade_volume_24h_btc_normalized * 50000),
      formattedTrustScore: formatTrustScore(exchangeDetails.trust_score),
      formattedStatus: formatStatus(exchangeDetails.status === "active"),
      countryFlag: getCountryFlag(exchangeDetails.country),
      tickers: exchangeDetails.tickers?.slice(0, 100) || [] // Limit to first 100 tickers
    };
  }, [exchangeDetails]);

  return {
    exchangeDetails: formattedExchangeDetails,
    isLoading,
    error,
    refetch
  };
};

// Utility functions
const formatVolume = (value) => {
  if (!value || value === 0) return "$0";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatTrustScore = (score) => {
  if (!score && score !== 0) return "N/A";
  return score.toFixed(1);
};

const formatStatus = (active) => {
  return active ? "Active" : "Inactive";
};

const getCountryFlag = (country) => {
  const flags = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Japan': '🇯🇵',
    'Singapore': '🇸🇬',
    'Hong Kong': '🇭🇰',
    'South Korea': '🇰🇷',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Netherlands': '🇳🇱',
    'Switzerland': '🇨🇭',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'China': '🇨🇳',
    'Russia': '🇷🇺',
    'Turkey': '🇹🇷',
    'South Africa': '🇿🇦'
  };
  return flags[country] || '🌍';
};
