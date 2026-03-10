import React from 'react';
import { ArrowUpRight, ArrowDownRight, Crown, Star } from 'lucide-react';

const CategoryHeroCard = ({ category }) => {
  if (!category) return null;

  const isPositive = category.market_cap_change_24h >= 0;
  const changeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 md:p-8 shadow-2xl mb-8">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24" />

      <div className="relative z-10">
        {/* Header with crown icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl text-nowrap font-bold text-foreground">
                Top Category
              </h2>
              <p className="text-xs md:text-md text-muted-foreground text-nowrap">
                Largest by market capitalization
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Category info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-3xl font-bold text-foreground mb-2">
                {category.name}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {category.content}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 rounded-2xl p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(category.market_cap)}
                </div>
              </div>
              <div className="bg-card/50 rounded-2xl p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Dominance</div>
                <div className="text-2xl font-bold text-foreground">
                  {category.dominance ? `${category.dominance.toFixed(2)}%` : '0.00%'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isPositive ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                {React.createElement(changeIcon, { className: `w-5 h-5 ${changeColor}` })}
                <span className={`font-bold ${changeColor}`}>
                  {isPositive ? '+' : ''}{category.market_cap_change_24h?.toFixed(2) || 0}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                24h change
              </div>
            </div>
          </div>

          {/* Right side - Top coins */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Top Coins</h4>
              <div className="space-y-3">
                {category.top_coins_data?.slice(0, 3).map((coinData, index) => {
                  const coinImage = category.top_3_coins?.[index];
                  const coinName = coinData?.name || category.top_3_coins_id?.[index]?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';

                  return (
                    <div key={coinData?.id || index} className="flex items-center justify-between bg-card/50 rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-3">
                        {coinImage && (
                          <img
                            src={coinImage}
                            alt={coinName}
                            className="w-8 h-8 rounded-full border border-border"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${coinData?.id || 'coin'}&background=random&color=fff&size=32`;
                            }}
                          />
                        )}
                        <div>
                          <div className="font-semibold text-foreground">{coinName}</div>
                          <div className="text-sm text-muted-foreground capitalize">{coinData?.symbol || coinData?.id || 'Unknown'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {formatCurrency(coinData?.market_cap || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Market Cap</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default CategoryHeroCard;
