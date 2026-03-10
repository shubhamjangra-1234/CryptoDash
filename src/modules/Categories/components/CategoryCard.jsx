import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight, Layers } from 'lucide-react';

const CategoryCard = ({ category, onClick }) => {
  const isPositive = category.market_cap_change_24h >= 0;
  const changeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeBg = isPositive ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30';

  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl cursor-pointer hover:scale-[1.02] transition-all duration-300"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-12 translate-x-12" />
      
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.content ? (category.content.length > 60 ? `${category.content.substring(0, 60)}...` : category.content) : 'No description available'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(category.market_cap)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Dominance</span>
            <span className="text-lg font-bold text-foreground">
              {category.dominance?.toFixed(1) || 0}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">24h Volume</span>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(category.volume_24h)}
            </span>
          </div>
        </div>

        {/* Change indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${changeBg} border`}>
          <changeIcon className={`w-4 h-4 ${changeColor}`} />
          <span className={`font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}{category.market_cap_change_24h?.toFixed(2) || 0}%
          </span>
          <span className="text-xs text-muted-foreground">24h</span>
        </div>

        {/* Top coins preview */}
        {category.top_3_coins && category.top_3_coins.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-2">Top Coins</div>
            <div className="flex items-center gap-2">
              {category.top_3_coins.slice(0, 3).map((coin, index) => (
                <div
                  key={coin.id || index}
                  className="px-2 py-1 bg-card/50 rounded-lg border border-border"
                  title={coin.name || 'Unknown'}
                >
                  <span className="text-xs font-medium text-foreground">
                    {coin.name ? coin.name.substring(0, 3).toUpperCase() : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
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

export default CategoryCard;
