// Dashboard Module Formatters
import { DASHBOARD_COLORS } from '../constants';

// Currency formatter
export const formatCurrency = (value, currency = 'USD', decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '-';
  
  // Format large numbers
  if (numValue >= 1e12) {
    return `$${(numValue / 1e12).toFixed(decimals)}T`;
  } else if (numValue >= 1e9) {
    return `$${(numValue / 1e9).toFixed(decimals)}B`;
  } else if (numValue >= 1e6) {
    return `$${(numValue / 1e6).toFixed(decimals)}M`;
  } else if (numValue >= 1e3) {
    return `$${(numValue / 1e3).toFixed(decimals)}K`;
  } else {
    return `$${numValue.toFixed(decimals)}`;
  }
};

// Number formatter
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '-';
  
  // Format large numbers
  if (numValue >= 1e9) {
    return `${(numValue / 1e9).toFixed(decimals)}B`;
  } else if (numValue >= 1e6) {
    return `${(numValue / 1e6).toFixed(decimals)}M`;
  } else if (numValue >= 1e3) {
    return `${(numValue / 1e3).toFixed(decimals)}K`;
  } else {
    return numValue.toLocaleString();
  }
};

// Percentage formatter
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '-';
  
  const formatted = numValue.toFixed(decimals);
  const sign = numValue >= 0 ? '+' : '';
  return `${sign}${formatted}%`;
};

// Price formatter
export const formatPrice = (value, currency = 'USD', decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numValue);
};

// Market cap formatter
export const formatMarketCap = (value) => {
  return formatCurrency(value, 'USD', 2);
};

// Volume formatter
export const formatVolume = (value) => {
  return formatCurrency(value, 'USD', 0);
};

// Change type formatter
export const formatChangeType = (value) => {
  if (value === null || value === undefined) return 'neutral';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'neutral';
  
  return numValue >= 0 ? 'positive' : 'negative';
};

// Change color formatter
export const formatChangeColor = (value) => {
  const changeType = formatChangeType(value);
  
  switch (changeType) {
    case 'positive':
      return DASHBOARD_COLORS.POSITIVE;
    case 'negative':
      return DASHBOARD_COLORS.NEGATIVE;
    default:
      return DASHBOARD_COLORS.NEUTRAL;
  }
};

// Rank formatter
export const formatRank = (value) => {
  if (value === null || value === undefined) return '-';
  return `#${parseInt(value, 10)}`;
};

// Symbol formatter
export const formatSymbol = (value) => {
  if (!value) return '-';
  return value.toUpperCase();
};

// Time formatter
export const formatTime = (timestamp) => {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Date formatter
export const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// DateTime formatter
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Sparkline formatter (mock implementation)
export const formatSparkline = (trend) => {
  if (!trend) return 'stable';
  
  switch (trend.toLowerCase()) {
    case 'up':
    case 'positive':
      return 'up';
    case 'down':
    case 'negative':
      return 'down';
    default:
      return 'stable';
  }
};

// Search highlight formatter
export const highlightSearch = (text, searchQuery) => {
  if (!text || !searchQuery) return text;
  
  const regex = new RegExp(`(${searchQuery})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Table cell formatter
export const formatTableCell = (value, type, row) => {
  switch (type) {
    case 'currency':
      return formatCurrency(value);
    case 'price':
      return formatPrice(value);
    case 'percentage':
      return formatPercentage(value);
    case 'marketCap':
      return formatMarketCap(value);
    case 'volume':
      return formatVolume(value);
    case 'rank':
      return formatRank(value);
    case 'symbol':
      return formatSymbol(value);
    case 'change':
      return {
        value: formatPercentage(value),
        type: formatChangeType(value),
        color: formatChangeColor(value)
      };
    case 'sparkline':
      return formatSparkline(value);
    case 'datetime':
      return formatDateTime(value);
    case 'time':
      return formatTime(value);
    case 'date':
      return formatDate(value);
    default:
      return value || '-';
  }
};
