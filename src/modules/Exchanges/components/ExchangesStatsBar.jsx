import React from 'react';
import { BarChart3, TrendingUp, Shield, Globe, Users, Activity } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
const ExchangesStatsBar = ({ analytics, loading }) => {
  const stats = [
    {
      title: 'Total Exchanges',
      value: analytics?.totalExchanges || 0,
      icon: BarChart3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Total Volume',
      value: formatCurrency(analytics?.totalVolume || 0),
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Avg Trust Score',
      value: analytics?.averageTrustScore ? analytics.averageTrustScore.toFixed(1) : '0.0',
      icon: Shield,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Countries',
      value: Object.keys(analytics?.countries || {}).length,
      icon: Globe,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      title: 'Centralized',
      value: analytics?.centralizedCount || 0,
      icon: Users,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-card rounded-2xl border border-border p-4 animate-pulse">
            <div className="h-12 bg-muted rounded-lg mb-2" />
            <div className="h-6 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card rounded-2xl border border-border p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-xs ${stat.color} text-nowrap font-medium`}>
              {stat.title.includes("Total") ? "Overview" : stat.title}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-nowrap text-foreground">
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

export default ExchangesStatsBar;
