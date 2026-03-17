import { useMemo } from 'react';

export const useCoinFormatters = () => {
  return useMemo(() => ({
    formatPrice: (price) => {
      if (!price || price === 0) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 0.01 ? 6 : 2,
      }).format(price);
    },

    formatMarketCap: (marketCap) => {
      if (!marketCap || marketCap === 0) return '$0';
      if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
      if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
      if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
      if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`;
      return `$${marketCap.toFixed(2)}`;
    },

    formatPercentage: (percentage) => {
      if (!percentage && percentage !== 0) return '0.00%';
      return `${Math.abs(percentage).toFixed(2)}%`;
    },

    formatNumber: (number) => {
      if (!number || number === 0) return '0';
      if (number >= 1e9) return `${(number / 1e9).toFixed(1)}B`;
      if (number >= 1e6) return `${(number / 1e6).toFixed(1)}M`;
      if (number >= 1e3) return `${(number / 1e3).toFixed(1)}K`;
      return Math.floor(number).toString();
    },
  }), []);
};
