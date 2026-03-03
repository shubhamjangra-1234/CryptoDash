import { useState, useMemo } from 'react';
import { useMarkets } from '../../crypto/hooks/useCryptoData';

// Hook for market data and filtering logic
export const useMarketData = () => {
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Paginated markets data
  const {
    data: markets,
    isLoading: marketsLoading,
    error,
    refetch
  } = useMarkets({
    vs_currency: 'usd',
    order: sortBy,
    per_page: pageSize,
    page: currentPage,
    sparkline: false
  });

  // Final data selector
  const finalMarkets = useMemo(() => {
    return markets ?? [];
  }, [markets]);

  // Calculate if there are more items available (for pagination)
  const hasMoreItems = finalMarkets.length === pageSize;

  // -----------------------
  // Handlers
  // -----------------------

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCoinClick = (coin) => {
    window.location.href = `/coin/${coin.id}`;
  };

  return {
    // Data
    finalMarkets,
    isLoading: marketsLoading,
    error,
    hasMoreItems,
    
    // State
    sortBy,
    currentPage,
    pageSize,
    sortOptions: [
      { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
      { value: 'market_cap_asc', label: 'Market Cap (Low to High)' },
      { value: 'volume_desc', label: 'Volume (High to Low)' },
      { value: 'volume_asc', label: 'Volume (Low to High)' },
      { value: 'change_desc', label: '24h Change (High to Low)' },
    ],
    
    // Actions
    onSortChange: handleSortChange,
    onPageChange: handlePageChange,
    onCoinClick: handleCoinClick,
    onRetry: refetch
  };
};