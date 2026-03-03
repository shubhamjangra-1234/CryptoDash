// Currency formatter
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value === null || value === undefined) return '$0.00';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num === 0) return '$0.00';
  
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  
  if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: num < 1 ? 4 : 2,
    maximumFractionDigits: num < 1 ? 4 : 2
  }).format(num);
};

// Number formatter
export const formatNumber = (value, locale = 'en-US') => {
  if (value === null || value === undefined) return '0';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num === 0) return '0';
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  
  return new Intl.NumberFormat(locale).format(num);
};

// Percentage formatter
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0.00%';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  return `${num.toFixed(decimals)}%`;
};

// Date formatter
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

// Time formatter
export const formatTime = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

// DateTime formatter
export const formatDateTime = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

// Relative time formatter (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateObj);
};

// Market cap formatter
export const formatMarketCap = (value) => {
  return formatCurrency(value);
};

// Volume formatter
export const formatVolume = (value) => {
  return formatCurrency(value);
};

// Supply formatter
export const formatSupply = (value, symbol = '') => {
  const formatted = formatNumber(value);
  return symbol ? `${formatted} ${symbol}` : formatted;
};

// Price formatter with proper decimal places
export const formatPrice = (value, currency = 'USD') => {
  if (value === null || value === undefined) return `$0.00`;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num < 0.01) {
    return `$${num.toFixed(6)}`;
  }
  
  if (num < 1) {
    return `$${num.toFixed(4)}`;
  }
  
  return formatCurrency(num, currency);
};

// Large number formatter for stats
export const formatLargeNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(decimals)}T`;
  }
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(decimals)}B`;
  }
  
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(decimals)}M`;
  }
  
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(decimals)}K`;
  }
  
  return num.toFixed(decimals);
};
