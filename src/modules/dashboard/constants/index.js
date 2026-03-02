// Dashboard Module Constants
export const DASHBOARD_CONFIG = {
  // Default values
  DEFAULT_CURRENCY: 'usd',
  DEFAULT_SORT: 'market_cap_desc',
  DEFAULT_LIMIT: 50,
  DEFAULT_VIEW_MODE: 'table',
  
  // Refresh intervals (in milliseconds)
  AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
  STATS_REFRESH_INTERVAL: 60000, // 1 minute
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Chart settings
  CHART_HEIGHT: 300,
  CHART_TIME_RANGE: '24h',
  
  // UI settings
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  
  // API settings
  API_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  
  // Cache settings
  CACHE_DURATION: 60000, // 1 minute
  
  // Error handling
  ERROR_RETRY_DELAY: 5000,
  MAX_ERROR_RETRIES: 3
};

export const DASHBOARD_MESSAGES = {
  LOADING: 'Loading dashboard data...',
  ERROR: 'Failed to load dashboard data',
  NO_DATA: 'No data available',
  REFRESH_SUCCESS: 'Dashboard data refreshed',
  EXPORT_SUCCESS: 'Data exported successfully',
  SEARCH_PLACEHOLDER: 'Search coins...',
  FILTER_PLACEHOLDER: 'Filter by...',
  SORT_PLACEHOLDER: 'Sort by...'
};

export const DASHBOARD_ROUTES = {
  DASHBOARD: '/',
  COIN_DETAIL: '/coin/:id',
  MARKETS: '/markets',
  CATEGORIES: '/categories',
  EXCHANGES: '/exchanges'
};

export const DASHBOARD_COLORS = {
  POSITIVE: '#10b981',
  NEGATIVE: '#ef4444',
  NEUTRAL: '#6b7280',
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444'
};
