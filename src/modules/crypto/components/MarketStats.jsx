import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react';

// Stats Card Component - Pure UI, no business logic
export const StatsCard = ({ title, value, change, icon: Icon, trend, className = "" }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <Card className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== null && change !== undefined && (
          <div className="flex items-center space-x-1 text-xs mt-1">
            {trend && (
              isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : isNegative ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : null
            )}
            <span className={isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-muted-foreground'}>
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Market Stats Grid Component - Pure UI, no business logic
export const MarketStatsGrid = ({ 
  totalMarketCap, 
  marketCapChange, 
  totalVolume, 
  btcDominance, 
  activeCryptos,
  className = "" 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      <StatsCard
        title="Total Market Cap"
        value={totalMarketCap ? `$${(totalMarketCap / 1e12).toFixed(2)}T` : 'Loading...'}
        change={marketCapChange}
        icon={DollarSign}
        trend={true}
      />
      <StatsCard
        title="24h Volume"
        value={totalVolume ? `$${(totalVolume / 1e9).toFixed(2)}B` : 'Loading...'}
        icon={Activity}
        trend={false}
      />
      <StatsCard
        title="BTC Dominance"
        value={btcDominance ? `${btcDominance.toFixed(1)}%` : 'Loading...'}
        icon={BarChart3}
        trend={false}
      />
      <StatsCard
        title="Active Cryptos"
        value={activeCryptos ? activeCryptos.toLocaleString() : 'Loading...'}
        icon={TrendingUp}
        trend={false}
      />
    </div>
  );
};

export default MarketStatsGrid;
