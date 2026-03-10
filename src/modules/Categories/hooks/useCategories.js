import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { cryptoService } from "../../crypto/services/cryptoService";

// Fetch categories from CoinGecko
const fetchCategories = async () => {
  try {
    const response = await cryptoService.getCategories();
    return response;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

// Fetch market data only for top category's coins
const fetchTopCategoryCoins = async (topCategory) => {
  if (!topCategory?.top_3_coins_id || topCategory.top_3_coins_id.length === 0) {
    return [];
  }

  try {
    const marketsData = await cryptoService.getMarkets({
      vs_currency: 'usd',
      per_page: 250,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h'
    });
    
    // Match and return only top category's coins
    return topCategory.top_3_coins_id.map(coinId => {
      const coinData = marketsData.find(coin => 
        coin.id.toLowerCase().includes(coinId.toLowerCase()) || 
        coinId.toLowerCase().includes(coin.id.toLowerCase())
      );
      
      return {
        id: coinId,
        name: coinData?.name || coinId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        symbol: coinData?.symbol || '',
        image: coinData?.image || '',
        market_cap: coinData?.market_cap || 0,
        current_price: coinData?.current_price || 0,
        price_change_percentage_24h: coinData?.price_change_percentage_24h || 0
      };
    });
  } catch (error) {
    console.error('Failed to fetch top category coins:', error);
    return topCategory.top_3_coins_id.map(coinId => ({
      id: coinId,
      name: coinId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      market_cap: 0
    }));
  }
};

export const useCategories = () => {
  const {
    data: rawCategories,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Normalize categories
  const categories = useMemo(() => {
    if (!rawCategories || !Array.isArray(rawCategories)) return [];

    return rawCategories.map((category) => ({
      id: category.id || `category-${Math.random()}`,
      name: category.name || "Unknown Category",
      market_cap: category.market_cap || 0,
      market_cap_change_24h: category.market_cap_change_24h || 0,
      volume_24h: category.volume_24h || 0,
      content: category.content || category.description || "",
      top_3_coins_id: Array.isArray(category.top_3_coins_id)
        ? category.top_3_coins_id
        : [],
      top_3_coins: Array.isArray(category.top_3_coins)
        ? category.top_3_coins
        : [],
      updated_at: category.updated_at || null
    }));
  }, [rawCategories]);

  // Analytics calculation
  const analytics = useMemo(() => {
    if (!categories.length) {
      return {
        totalCategories: 0,
        totalMarketCap: 0,
        totalVolume: 0,
        averageMarketCap: 0,
        topCategory: null,
        categoryDominance: []
      };
    }

    const totalMarketCap = categories.reduce(
      (sum, cat) => sum + (cat.market_cap || 0),
      0
    );

    const totalVolume = categories.reduce(
      (sum, cat) => sum + (cat.volume_24h || 0),
      0
    );

    const averageMarketCap = totalMarketCap / categories.length;

    const categoriesWithDominance = categories.map((cat) => ({
      ...cat,
      dominance:
        totalMarketCap > 0 ? (cat.market_cap / totalMarketCap) * 100 : 0
    }));

    const topCategory = categoriesWithDominance.reduce((max, cat) =>
      cat.market_cap > (max?.market_cap || 0) ? cat : max
    , null);

    const categoryDominance = [...categoriesWithDominance]
      .sort((a, b) => b.market_cap - a.market_cap)
      .slice(0, 10);

    return {
      totalCategories: categories.length,
      totalMarketCap,
      totalVolume,
      averageMarketCap,
      topCategory,
      categoryDominance
    };
  }, [categories]);

  // Fetch coins data only for top category
  const {
    data: topCategoryCoins,
    isLoading: isLoadingCoins,
    error: coinsError,
    refetch: refetchCoins
  } = useQuery({
    queryKey: ['topCategoryCoins', analytics.topCategory?.id],
    queryFn: () => fetchTopCategoryCoins(analytics.topCategory),
    enabled: !!analytics.topCategory, // Only fetch when we have top category
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Combine top category with its coins data
  const enrichedTopCategory = useMemo(() => {
    if (!analytics.topCategory || !topCategoryCoins) return analytics.topCategory;
    return {
      ...analytics.topCategory,
      top_coins_data: topCategoryCoins
    };
  }, [analytics.topCategory, topCategoryCoins]);

  // Final categories with formatting
  const finalCategories = useMemo(() => {
    if (!categories.length) return [];

    return categories.map((cat) => ({
      ...cat,
      dominance:
        analytics.totalMarketCap > 0
          ? (cat.market_cap / analytics.totalMarketCap) * 100
          : 0,
      formattedMarketCap: formatCurrency(cat.market_cap),
      formattedVolume: formatCurrency(cat.volume_24h),
      formattedChange: formatPercentage(cat.market_cap_change_24h),
      changeColor:
        (cat.market_cap_change_24h || 0) >= 0 ? "positive" : "negative",
      lastUpdated: cat.updated_at
        ? new Date(cat.updated_at).toLocaleDateString()
        : "Unknown"
    }));
  }, [categories, analytics.totalMarketCap]);

  // Combined loading state
  const isLoadingCombined = isLoading || (isLoadingCoins && !!analytics.topCategory);
  // Combined error state
  const errorCombined = error || coinsError;

  // Combined refetch
  const refetchCombined = () => {
    refetch();
    if (analytics.topCategory) {
      refetchCoins();
    }
  };

  return {
    categories: finalCategories,
    analytics: {
      ...analytics,
      topCategory: enrichedTopCategory
    },
    isLoading: isLoadingCombined,
    error: errorCombined,
    refetch: refetchCombined
  };
};

// Currency formatter
const formatCurrency = (value) => {
  if (!value) return "$0";

  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;

  return `$${value.toFixed(2)}`;
};

// Percentage formatter
const formatPercentage = (value) => {
  if (!value) return "0.00%";

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};