import { useMemo } from 'react';

export const useCoinCalculations = (coin) => {
  return useMemo(() => {
    const isPositive = (coin?.priceChange24h || 0) >= 0;
    
    const performanceMetrics = [
      { label: '1H', value: coin?.priceChange1h, key: 'priceChange1h' },
      { label: '24H', value: coin?.priceChange24h, key: 'priceChange24h' },
      { label: '7D', value: coin?.priceChange7d, key: 'priceChange7d' },
      { label: '14D', value: coin?.priceChange14d, key: 'priceChange14d' },
      { label: '30D', value: coin?.priceChange30d, key: 'priceChange30d' },
      { label: '200D', value: coin?.priceChange200d, key: 'priceChange200d' },
      { label: '1Y', value: coin?.priceChange1y, key: 'priceChange1y' }
    ];

    const supplyPercentage = coin?.totalSupply > 0 ? 
      (coin?.circulatingSupply / coin?.maxSupply) * 100 : 0;

    const getImageUrl = (size = 'large') => {
      if (coin?.image && typeof coin?.image === 'object') {
        return coin.image[size] || coin.image.large || coin.image.small || coin.image.thumb || '/placeholder-coin.png';
      }
      return coin?.image || '/placeholder-coin.png';
    };

    return {
      isPositive,
      performanceMetrics,
      supplyPercentage,
      getImageUrl,
    };
  }, [coin]);
};
