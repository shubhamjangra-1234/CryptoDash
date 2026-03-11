// Currency formatter for exchanges
export const formatCurrency = (value, short = false) => {
  if (!value) return "$0";
  
  if (short) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  }
  
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

// Percentage formatter
export const formatPercentage = (value) => {
  if (!value) return "0.00%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

// Volume formatter (24h trading volume)
export const formatVolume = (value) => {
  if (!value || value === 0) return "$0";
  
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

// Trust score formatter
export const formatTrustScore = (score) => {
  if (!score && score !== 0) return "N/A";
  return score.toFixed(1);
};

// Exchange status formatter
export const formatStatus = (active) => {
  return active ? "Active" : "Inactive";
};

// Country flag formatter
export const getCountryFlag = (country) => {
  const flags = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Japan': '🇯🇵',
    'Singapore': '🇸🇬',
    'Hong Kong': '🇭🇰',
    'South Korea': '🇰🇷',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Netherlands': '🇳🇱',
    'Switzerland': '🇨🇭',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'China': '🇨🇳',
    'Russia': '🇷🇺',
    'Turkey': '🇹🇷',
    'South Africa': '🇿🇦'
  };
  return flags[country] || '🌍';
};
