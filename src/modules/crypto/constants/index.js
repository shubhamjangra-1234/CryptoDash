// API Endpoints
export const API_ENDPOINTS = {
  MARKETS: '/coins/markets',
  COIN_DETAILS: '/coins/{id}',
  MARKET_CHART: '/coins/{id}/market_chart',
  GLOBAL_DATA: '/global',
  SEARCH: '/search',
  CATEGORIES: '/coins/categories',
  EXCHANGES: '/exchanges'
};

// Default Parameters
export const DEFAULT_PARAMS = {
  CURRENCY: 'usd',
  ORDER: 'market_cap_desc',
  PER_PAGE: 100,
  PAGE: 1,
  SPARKLINE: false,
  PRICE_CHANGE_PERCENTAGE: '24h',
  LOCALIZATION: false,
  TICKERS: false,
  MARKET_DATA: true,
  COMMUNITY_DATA: false,
  DEVELOPER_DATA: false
};

// Time Ranges for Charts
export const TIME_RANGES = {
  HOUR_24: { label: '24H', value: 1 },
  DAYS_7: { label: '7D', value: 7 },
  DAYS_30: { label: '30D', value: 30 },
  DAYS_90: { label: '90D', value: 90 },
  YEAR_1: { label: '1Y', value: 365 }
};

// Sort Options for Markets
export const SORT_OPTIONS = {
  MARKET_CAP_DESC: { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
  MARKET_CAP_ASC: { value: 'market_cap_asc', label: 'Market Cap (Low to High)' },
  PRICE_DESC: { value: 'price_desc', label: 'Price (High to Low)' },
  PRICE_ASC: { value: 'price_asc', label: 'Price (Low to High)' },
  VOLUME_DESC: { value: 'volume_desc', label: 'Volume (High to Low)' },
  VOLUME_ASC: { value: 'volume_asc', label: 'Volume (Low to High)' },
  CHANGE_DESC: { value: 'change_desc', label: '24h Change (High to Low)' },
  CHANGE_ASC: { value: 'change_asc', label: '24h Change (Low to High)' }
};

// Chart Types
export const CHART_TYPES = {
  PRICES: 'prices',
  MARKET_CAPS: 'marketCaps',
  VOLUMES: 'totalVolumes'
};

// Trust Score Levels
export const TRUST_SCORE_LEVELS = {
  EXCELLENT: { min: 8, max: 10, label: 'Excellent', color: 'green' },
  GOOD: { min: 6, max: 7.9, label: 'Good', color: 'yellow' },
  FAIR: { min: 4, max: 5.9, label: 'Fair', color: 'orange' },
  POOR: { min: 0, max: 3.9, label: 'Poor', color: 'red' }
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 100,
  MAX_PAGE_SIZE: 250,
  MIN_PAGE_SIZE: 10
};

// Cache Settings (in milliseconds)
export const CACHE_SETTINGS = {
  MARKETS_STALE_TIME: 60000, // 1 minute
  MARKETS_REFETCH_INTERVAL: 300000, // 5 minutes
  COIN_DETAILS_STALE_TIME: 300000, // 5 minutes
  COIN_DETAILS_REFETCH_INTERVAL: 600000, // 10 minutes
  MARKET_CHART_STALE_TIME: 60000, // 1 minute
  MARKET_CHART_REFETCH_INTERVAL: 300000, // 5 minutes
  GLOBAL_DATA_STALE_TIME: 600000, // 10 minutes
  GLOBAL_DATA_REFETCH_INTERVAL: 600000, // 10 minutes
  CATEGORIES_STALE_TIME: 3600000, // 1 hour
  CATEGORIES_REFETCH_INTERVAL: 3600000, // 1 hour
  EXCHANGES_STALE_TIME: 300000, // 5 minutes
  EXCHANGES_REFETCH_INTERVAL: 600000 // 10 minutes
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  RATE_LIMIT: 'Rate limit exceeded. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access. Please check your API key.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Formatters
export const FORMATTERS = {
  CURRENCY: 'USD',
  LOCALE: 'en-US',
  DATE_FORMAT: {
    SHORT: { year: 'numeric', month: 'short', day: 'numeric' },
    LONG: { year: 'numeric', month: 'long', day: 'numeric' },
    TIME: { hour: '2-digit', minute: '2-digit' },
    DATETIME: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }
  }
};

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MARKETS: '/markets',
  COIN_DETAIL: '/coin/:id',
  CATEGORIES: '/categories',
  EXCHANGES: '/exchanges',
  SEARCH: '/search'
};

// UI Constants
export const UI = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  SEARCH_MIN_LENGTH: 2,
  MAX_SEARCH_RESULTS: 10,
  TABLE_PAGE_SIZES: [10, 25, 50, 100],
  CHART_HEIGHT: 256,
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64
};

// Colors
export const COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#6b7280',
  POSITIVE: '#10b981',
  NEGATIVE: '#ef4444',
  NEUTRAL: '#6b7280'
};

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};

// Grid Settings
export const GRID = {
  COLUMNS: {
    DASHBOARD_STATS: 4,
    TOP_MOVERS: 2,
    FULL_WIDTH: 1
  },
  GAP: {
    SMALL: '1rem',
    MEDIUM: '2rem',
    LARGE: '3rem'
  }
};
