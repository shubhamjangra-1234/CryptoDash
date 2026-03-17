import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_CONFIG, DASHBOARD_MESSAGES } from '../constants';
import { SORT_OPTIONS, VIEW_MODES, CURRENCIES } from '../types';

// Custom hook for dashboard state management
export const useDashboard = (initialConfig = {}) => {
  // State management
  const [viewMode, setViewMode] = useState(initialConfig.viewMode || DASHBOARD_CONFIG.DEFAULT_VIEW_MODE);
  const [sortBy, setSortBy] = useState(initialConfig.sortBy || DASHBOARD_CONFIG.DEFAULT_SORT);
  const [currency, setCurrency] = useState(initialConfig.currency || DASHBOARD_CONFIG.DEFAULT_CURRENCY);
  const [limit, setLimit] = useState(initialConfig.limit || DASHBOARD_CONFIG.DEFAULT_LIMIT);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, DASHBOARD_CONFIG.AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleViewModeChange = useCallback((newViewMode) => {
    if (Object.values(VIEW_MODES).includes(newViewMode)) {
      setViewMode(newViewMode);
    }
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    if (Object.values(SORT_OPTIONS).includes(newSortBy)) {
      setSortBy(newSortBy);
    }
  }, []);

  const handleCurrencyChange = useCallback((newCurrency) => {
    if (Object.values(CURRENCIES).includes(newCurrency)) {
      setCurrency(newCurrency);
    }
  }, []);

  const handleLimitChange = useCallback((newLimit) => {
    const numLimit = parseInt(newLimit, 10);
    if (numLimit > 0 && numLimit <= DASHBOARD_CONFIG.MAX_PAGE_SIZE) {
      setLimit(numLimit);
    }
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // This will trigger refetch in the query
      setLastRefreshTime(new Date());
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleExport = useCallback(() => {
    // Export functionality
    // Implementation would go here
  }, []);

  const resetFilters = useCallback(() => {
    setViewMode(DASHBOARD_CONFIG.DEFAULT_VIEW_MODE);
    setSortBy(DASHBOARD_CONFIG.DEFAULT_SORT);
    setCurrency(DASHBOARD_CONFIG.DEFAULT_CURRENCY);
    setLimit(DASHBOARD_CONFIG.DEFAULT_LIMIT);
    setSearchQuery('');
  }, []);

  // Computed values
  const hasActiveFilters = searchQuery || 
    sortBy !== DASHBOARD_CONFIG.DEFAULT_SORT ||
    currency !== DASHBOARD_CONFIG.DEFAULT_CURRENCY ||
    limit !== DASHBOARD_CONFIG.DEFAULT_LIMIT;

  const dashboardConfig = {
    viewMode,
    sortBy,
    currency,
    limit,
    searchQuery,
    isRefreshing,
    lastRefreshTime,
    hasActiveFilters
  };

  const dashboardActions = {
    setViewMode: handleViewModeChange,
    setSortBy: handleSortChange,
    setCurrency: handleCurrencyChange,
    setLimit: handleLimitChange,
    setSearchQuery: handleSearchChange,
    refresh: handleRefresh,
    export: handleExport,
    resetFilters
  };

  return {
    config: dashboardConfig,
    actions: dashboardActions,
    messages: DASHBOARD_MESSAGES
  };
};
