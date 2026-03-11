import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { cryptoService } from "../../crypto/services/cryptoService";

// Fetch markets for a specific exchange
const fetchExchangeMarkets = async (exchangeId, options = {}) => {
  try {
    const response = await cryptoService.getExchangeMarkets(exchangeId, {
      limit: options.limit || 100,
      page: options.page || 1
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch exchange markets:", error);
    throw error;
  }
};

export const useExchangeMarkets = (exchangeId, options = {}) => {
  const {
    data: rawMarkets,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["exchangeMarkets", exchangeId, options],
    queryFn: () => fetchExchangeMarkets(exchangeId, options),
    enabled: !!exchangeId,
    staleTime: 2 * 60 * 1000, // 2 minutes for markets (more frequent updates)
    retry: 2
  });

  // Normalize markets data
  const markets = useMemo(() => {
    if (!rawMarkets || !Array.isArray(rawMarkets)) return [];

    return rawMarkets.map((market) => ({
      id: market.id || `${exchangeId}-${market.base}-${market.target}`,
      base: market.base || "Unknown",
      target: market.target || "Unknown",
      pair: `${market.base || "Unknown"}/${market.target || "Unknown"}`,
      volume: market.converted_volume?.usd || market.volume || 0,
      price: market.last || market.price || 0,
      change: market.price_change_percentage_24h || market.change || 0,
      bid: market.bid || 0,
      ask: market.ask || 0,
      spread: market.bid && market.ask ? market.ask - market.bid : 0,
      spread_percentage: market.bid && market.ask ? ((market.ask - market.bid) / market.ask) * 100 : 0,
      high_24h: market.high || 0,
      low_24h: market.low || 0,
      is_anomaly: market.is_anomaly || false,
      trust_score: market.trust_score || null,
      trade_url: market.trade_url || "",
      last_updated: market.last_updated || null,
      formattedVolume: formatCurrency(market.converted_volume?.usd || market.volume || 0),
      formattedPrice: formatCurrency(market.last || market.price || 0),
      formattedChange: formatPercentage(market.price_change_percentage_24h || market.change || 0),
      formattedSpread: formatPercentage(market.bid && market.ask ? ((market.ask - market.bid) / market.ask) * 100 : 0),
      formattedHigh: formatCurrency(market.high || 0),
      formattedLow: formatCurrency(market.low || 0),
      changeColor: (market.price_change_percentage_24h || market.change || 0) >= 0 ? 'positive' : 'negative'
    }));
  }, [rawMarkets, exchangeId]);

  // Analytics for exchange markets
  const analytics = useMemo(() => {
    if (!markets.length) {
      return {
        totalMarkets: 0,
        totalVolume: 0,
        averagePrice: 0,
        topMarkets: [],
        volumeDistribution: [],
        priceChanges: {
          positive: 0,
          negative: 0,
          neutral: 0
        },
        averageSpread: 0,
        mostVolatile: null
      };
    }

    const totalVolume = markets.reduce((sum, market) => sum + (market.volume || 0), 0);
    const averagePrice = markets.reduce((sum, market) => sum + (market.price || 0), 0) / markets.length;
    
    // Get top markets by volume
    const topMarkets = [...markets]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    // Calculate volume distribution by base currency
    const volumeDistribution = markets.reduce((acc, market) => {
      const base = market.base || 'Unknown';
      acc[base] = (acc[base] || 0) + (market.volume || 0);
      return acc;
    }, {});

    // Count price changes
    const priceChanges = markets.reduce((acc, market) => {
      const change = market.change || 0;
      if (change > 0) acc.positive++;
      else if (change < 0) acc.negative++;
      else acc.neutral++;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    // Calculate average spread
    const validSpreads = markets.filter(m => m.spread_percentage !== null && m.spread_percentage !== undefined);
    const averageSpread = validSpreads.length > 0 
      ? validSpreads.reduce((sum, market) => sum + market.spread_percentage, 0) / validSpreads.length
      : 0;

    // Find most volatile market
    const mostVolatile = markets.reduce((max, market) => {
      const volatility = Math.abs(market.change || 0);
      const maxVolatility = Math.abs(max?.change || 0);
      return volatility > maxVolatility ? market : max;
    }, null);

    return {
      totalMarkets: markets.length,
      totalVolume,
      averagePrice,
      topMarkets,
      volumeDistribution,
      priceChanges,
      averageSpread,
      mostVolatile
    };
  }, [markets]);

  return {
    markets,
    analytics,
    isLoading,
    error,
    refetch
  };
};

// Utility functions
const formatCurrency = (value) => {
  if (!value || value === 0) return "$0";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatPercentage = (value) => {
  if (!value) return "0.00%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};
