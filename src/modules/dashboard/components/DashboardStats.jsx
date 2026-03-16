import React from 'react';
import StatCard from '../../../shared/components/StatCard';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { DollarSign, Activity, BarChart3, TrendingUp, Globe, Shield, Users } from 'lucide-react';

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
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: '24h Volume',
      value: formatCurrency(safeData.totalVolume ?? 0),
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'BTC Dominance',
      value: `${(safeData.btcDominance ?? 0).toFixed(1)}%`,
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Active Cryptos',
      value: formatNumber(safeData.activeCryptos ?? 0),
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-card rounded-2xl border border-border p-4 animate-pulse">
            <div className="h-12 bg-muted rounded-lg mb-2" />
            <div className="h-6 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">Error loading stats</div>
          <div className="text-muted-foreground text-sm">
            {error.message || 'Failed to load market statistics'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card rounded-2xl border border-border p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-xs ${stat.color} font-medium`}>
              {stat.title.includes("Total") ? "Overview" : stat.title}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
