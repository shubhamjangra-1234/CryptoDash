import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Minus, MoreHorizontal } from 'lucide-react';

// Change Badge Component
export const ChangeBadge = ({ value, className = "" }) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  return (
    <Badge 
      variant={isPositive ? "default" : isNegative ? "destructive" : "secondary"}
      className={`flex items-center space-x-1 ${className}`}
    >
      {isPositive && <ArrowUpRight className="h-3 w-3" />}
      {isNegative && <ArrowDownRight className="h-3 w-3" />}
      {isNeutral && <Minus className="h-3 w-3" />}
      <span>
        {value !== null && value !== undefined ? 
          `${value >= 0 ? '+' : ''}${value.toFixed(2)}%` : 
          'N/A'
        }
      </span>
    </Badge>
  );
};

// Crypto Card Component
export const CryptoCard = ({ crypto, onViewDetails }) => {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={crypto.image} 
              alt={crypto.name}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.target.src = '/placeholder-coin.png';
              }}
            />
            <div>
              <CardTitle className="text-lg">{crypto.name}</CardTitle>
              <p className="text-sm text-muted-foreground uppercase">{crypto.symbol}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            ${crypto.current_price?.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            }) || 'N/A'}
          </span>
          <ChangeBadge value={crypto.price_change_percentage_24h} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p className="font-medium">
              ${crypto.market_cap ? (crypto.market_cap / 1e9).toFixed(2) + 'B' : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume (24h)</p>
            <p className="font-medium">
              ${crypto.total_volume ? (crypto.total_volume / 1e9).toFixed(2) + 'B' : 'N/A'}
            </p>
          </div>
        </div>
        
        {onViewDetails && (
          <Button 
            onClick={() => onViewDetails(crypto.id)}
            className="w-full"
            variant="outline"
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Crypto Detail Panel Component
export const CryptoDetailPanel = ({ crypto }) => {
  if (!crypto) return null;

  const details = [
    { label: 'Market Cap Rank', value: `#${crypto.market_cap_rank}` },
    { label: 'Current Price', value: `$${crypto.current_price?.toLocaleString() || 'N/A'}` },
    { label: 'Market Cap', value: `$${crypto.market_cap ? (crypto.market_cap / 1e9).toFixed(2) + 'B' : 'N/A'}` },
    { label: '24h High', value: `$${crypto.high_24h?.toLocaleString() || 'N/A'}` },
    { label: '24h Low', value: `$${crypto.low_24h?.toLocaleString() || 'N/A'}` },
    { label: 'Circulating Supply', value: crypto.circulating_supply?.toLocaleString() || 'N/A' },
    { label: 'Total Supply', value: crypto.total_supply?.toLocaleString() || 'N/A' },
    { label: 'Max Supply', value: crypto.max_supply?.toLocaleString() || '∞' },
    { label: '24h Volume', value: `$${crypto.total_volume ? (crypto.total_volume / 1e9).toFixed(2) + 'B' : 'N/A'}` }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <img 
            src={crypto.image} 
            alt={crypto.name}
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              e.target.src = '/placeholder-coin.png';
            }}
          />
          <div>
            <CardTitle className="text-xl">{crypto.name}</CardTitle>
            <p className="text-muted-foreground uppercase">{crypto.symbol}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">{detail.label}</span>
              <span className="font-medium text-foreground">{detail.value}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-muted/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">24h Change</span>
            <ChangeBadge value={crypto.price_change_percentage_24h} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Crypto Skeleton Loader
export const CryptoCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-12 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
