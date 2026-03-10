import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Layers } from 'lucide-react';

const CategoryStatsBar = ({ analytics }) => {
  const { totalCategories, topCategory, totalMarketCap, totalVolume } = analytics;

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories,
      icon: Layers,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Total Market Cap",
      value: formatCurrency(totalMarketCap),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
        {
      title: "Total Volume (24h)",
      value: formatCurrency(totalVolume),
      icon: TrendingDown,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      title: "Largest Category",
      value: topCategory?.name || "N/A",
      subtitle: formatCurrency(topCategory?.market_cap || 0),
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },

  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl border ${stat.borderColor} bg-card p-6 shadow-xl hover:scale-[1.02] transition-all duration-300`}
        >
          <div className="relative z-10">
            <div className={`flex items-center justify-between mb-4`}>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-xs ${stat.color} font-medium`}>
                {stat.title}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg md:text-2xl text-nowrap font-bold text-foreground">
                {stat.value}
              </div>
              {stat.subtitle && (
                <div className="text-sm text-muted-foreground">
                  {stat.subtitle}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
        </div>
      ))}
    </div>
  );
};

// Utility function
const formatCurrency = (value) => {
  if (!value) return "$0";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export default CategoryStatsBar;
