import React from 'react';
import StatCard from '../../../shared/components/StatCard';
import { formatCurrency, formatNumber } from '../utils/formatters';

const GlobalStatsGrid = React.memo(({ data, loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCard key={i} loading={true} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full text-center text-red-600">
          <p className="font-medium">Error loading global stats</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full text-center text-gray-500">
          <p>No global data available</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Market Cap",
      value: data.totalMarketCap?.usd || 0,
      change: data.marketCapChangePercentage24hUsd,
      changeType: 'percentage'
    },
    {
      title: "24h Volume",
      value: data.totalVolume?.usd || 0,
      change: data.volumeChangePercentage24hUsd,
      changeType: 'percentage'
    },
    {
      title: "BTC Dominance",
      value: data.marketCapPercentage?.btc || 0,
      change: null,
      changeType: 'percentage',
      valueClassName: "text-2xl font-bold"
    },
    {
      title: "Active Cryptos",
      value: data.activeCryptocurrencies || 0,
      change: null,
      changeType: 'number'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          valueClassName={stat.valueClassName}
        />
      ))}
    </div>
  );
});

GlobalStatsGrid.displayName = 'GlobalStatsGrid';

export default GlobalStatsGrid;
