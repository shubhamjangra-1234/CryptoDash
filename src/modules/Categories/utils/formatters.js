// Currency formatting utilities
export const formatCurrency = (value, short = false) => {
  if (!value || value === 0) return "$0";
  
  if (short) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  }
  
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

// Percentage formatting
export const formatPercentage = (value, decimals = 2) => {
  if (!value) return "0.00%";
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

// Number formatting with commas
export const formatNumber = (value) => {
  if (!value) return "0";
  return value.toLocaleString();
};

// Market cap change color helper
export const getChangeColor = (value) => {
  if (!value) return 'text-gray-400';
  return value >= 0 ? 'text-green-400' : 'text-red-400';
};

// Market cap change background helper
export const getChangeBackground = (value) => {
  if (!value) return 'bg-gray-500/10 border-gray-500/30';
  return value >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30';
};

// Category name formatting
export const formatCategoryName = (name) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Time formatting
export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

// Volume formatting (24h)
export const formatVolume = (value) => {
  if (!value) return "$0";
  return formatCurrency(value);
};
