import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cryptoService } from '../../crypto/services/cryptoService';

// Fetch category details from CoinGecko API
const fetchCategoryDetail = async (categoryId) => {
  try {
    // First get all categories and find the specific one
    const categories = await cryptoService.getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Get market data for coins in this category
    const coinIds = category.top_3_coins_id || [];
    let coinsData = [];
    
    if (coinIds.length > 0) {
      try {
        const marketsData = await cryptoService.getMarkets({
          vs_currency: 'usd',
          per_page: 250, // Get more coins to find category coins
          page: 1
        });
        
        // Filter coins that belong to this category
        coinsData = marketsData.filter(coin => 
          coinIds.some(id => coin.id.toLowerCase().includes(id.toLowerCase()))
        );
      } catch (error) {
        console.warn('Failed to fetch coins data:', error);
        // Continue without coins data
      }
    }
    
    return {
      ...category,
      coins: coinsData,
      totalCoins: coinsData.length
    };
  } catch (error) {
    console.error('Failed to fetch category details:', error);
    throw error;
  }
};

export const useCategoryDetail = (categoryId) => {
  const {
    data: categoryDetail,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['categoryDetail', categoryId],
    queryFn: () => fetchCategoryDetail(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Process category data
  const processedCategory = useMemo(() => {
    if (!categoryDetail) return null;
    
    return {
      ...categoryDetail,
      dominance: 0, // Will be calculated if we have total market data
      formattedMarketCap: formatCurrency(categoryDetail.market_cap || 0),
      formattedVolume: formatCurrency(categoryDetail.volume_24h || 0),
      formattedChange: formatPercentage(categoryDetail.market_cap_change_24h || 0),
      changeColor: (categoryDetail.market_cap_change_24h || 0) >= 0 ? 'positive' : 'negative',
      lastUpdated: categoryDetail.updated_at ? new Date(categoryDetail.updated_at).toLocaleDateString() : 'Unknown',
      coins: (categoryDetail.coins || []).map(coin => ({
        ...coin,
        formattedMarketCap: formatCurrency(coin.market_cap || 0),
        formattedVolume: formatCurrency(coin.total_volume || 0),
        formattedPrice: formatPrice(coin.current_price || 0),
        formattedChange: formatPercentage(coin.price_change_percentage_24h || 0),
        changeColor: (coin.price_change_percentage_24h || 0) >= 0 ? 'positive' : 'negative'
      }))
    };
  }, [categoryDetail]);

  return {
    // Data
    category: processedCategory,
    
    // States
    isLoading,
    error,
    
    // Actions
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

const formatPrice = (value) => {
  if (!value || value === 0) return "$0.00";
  if (value < 0.01) return `$${value.toFixed(6)}`;
  if (value < 1) return `$${value.toFixed(4)}`;
  if (value >= 1000) return `$${value.toLocaleString()}`;
  return `$${value.toFixed(2)}`;
};

const formatPercentage = (value) => {
  if (!value || value === 0) return "0.00%";
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
