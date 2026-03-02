import React from 'react';
import StatCard from '../../../shared/components/StatCard';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { DollarSign, Activity, BarChart3, TrendingUp } from 'lucide-react';

const DashboardStats = ({ 
  data = {}, 
  loading = false, 
  error = null,
  onStatClick = null
}) => {
  // Handle null/undefined data
  const safeData = data || {};
  
  const stats = [
    {
      title: 'Total Market Cap',
      value: formatCurrency(safeData.totalMarketCap ?? 0),
      change: safeData.marketCapChange ?? 0,
      icon: DollarSign,
      trend: true,
      onClick: () => onStatClick?.('market_cap')
    },
    {
      title: '24h Volume',
      value: formatCurrency(safeData.totalVolume ?? 0),
      change: safeData.volumeChange ?? 0,
      icon: Activity,
      trend: true,
      onClick: () => onStatClick?.('volume')
    },
    {
      title: 'BTC Dominance',
      value: `${(safeData.btcDominance ?? 0).toFixed(1)}%`,
      change: safeData.btcDominanceChange ?? 0,
      icon: BarChart3,
      trend: true,
      onClick: () => onStatClick?.('btc_dominance')
    },
    {
      title: 'Active Cryptos',
      value: formatNumber(safeData.activeCryptos ?? 0),
      change: `+${safeData.activeCryptosChange ?? 0}`,
      icon: TrendingUp,
      trend: false,
      onClick: () => onStatClick?.('active_cryptos')
    }
  ];

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            loading={false}
            error={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          loading={loading}
          error={false}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
