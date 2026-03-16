import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { formatPercentage, formatMarketCap, formatPrice } from '../utils/formatters';
import { TrendingUp, TrendingDown, Bitcoin, ArrowRight, DollarSign, Activity } from 'lucide-react';

const MarketPairPerformance = ({ coin, loading, error }) => {
  // Debug logging to see actual API data
  console.log('MarketPairPerformance - coin data:', coin);
  console.log('Available fields:', Object.keys(coin || {}));
  console.log('Current price:', coin.current_price);
  console.log('Total volume:', coin.totalVolume);
  console.log('Market cap:', coin.marketCap);
  console.log("Market Data ",coin.market_data);
    console.log("fdv ",coin.market_cap_fdv_ratio);
console.log("Market Cap Change Percentage 24h",coin.market_cap_change_percentage_24h);
console.log("Market Cap Change 24h",coin.market_cap_change_24h);
console.log("Market Cap Change 24h In Currency",coin.market_cap_change_24h_in_currency);
console.log("Market Cap Change Percentage 24h In Currency",coin.market_cap_change_percentage_24h_in_currency);
  console.log('Price change 24h:', coin.price_change_percentage_24h);
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-1/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading market data</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load market data'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Real market data from API - using correct field names from console
  const marketData = [
    {
      pair: `${coin.symbol.toUpperCase()}/USD`,
      base: coin.symbol.toUpperCase(),
      quote: 'USD',
      price: coin.currentPrice || 0,
      volume24h: coin.totalVolume || 0,
      marketCap: coin.marketCap || 0,
      change24h: coin.priceChange24h || 0,
      icon: <DollarSign className="w-4 h-4 text-green-600" />,
      description: 'US Dollar Pair'
    },
    {
      pair: `${coin.symbol.toUpperCase()}/BTC`,
      base: coin.symbol.toUpperCase(),
      quote: 'BTC',
      price: coin.price_btc || 0,
      volume24h: coin.total_volume_btc || 0,
      marketCap: coin.market_cap_btc || 0,
      change24h: coin.price_change_percentage_24h_in_currency || 0,
      icon: <Bitcoin className="w-4 h-4 text-orange-500" />,
      description: 'Bitcoin Pair'
    }
  ];

  // Calculate market stats
  const totalVolume = marketData.reduce((sum, market) => sum + (market.volume24h || 0), 0);
  const avgChange = marketData.reduce((sum, market) => sum + (market.change24h || 0), 0) / marketData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-muted-foreground" />
          Market Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Total Volume (24h)</div>
            <div className="text-lg font-bold text-foreground">
              {formatMarketCap(totalVolume)}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Average Change</div>
            <div className={`text-lg font-bold ${avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {avgChange >= 0 ? '+' : ''}{formatPercentage(avgChange)}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Active Pairs</div>
            <div className="text-lg font-bold text-foreground">
              {marketData.length}
            </div>
          </div>
        </div>

        {/* Market Pairs */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Trading Pairs</h4>
          {marketData.map((market) => {
            const isPositive = (market.change24h || 0) >= 0;
            return (
              <div key={market.pair} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {market.icon}
                    <span className="font-mono text-sm font-bold">{market.pair}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{market.description}</div>
                    <div className="text-xs text-muted-foreground">
                      Vol: {formatMarketCap(market.volume24h)} • Cap: {formatMarketCap(market.marketCap)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground mb-1">
                    {formatPrice(market.price)}
                  </div>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{formatPercentage(market.change24h)}
                    </span>
                    <Badge 
                      variant={isPositive ? "positive" : "destructive"}
                      className="text-xs"
                    >
                      {isPositive ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Market Insights */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-semibold text-foreground mb-3">Market Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-muted-foreground">
                  <strong>{coin.name}</strong> is actively traded across {marketData.length} major pairs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-muted-foreground">
                  24h volume: <strong>{formatMarketCap(totalVolume)}</strong>
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm text-muted-foreground">
                  USD pair dominates with <strong>{((coin.total_volume / totalVolume) * 100).toFixed(1)}%</strong> of total volume
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-sm text-muted-foreground">
                  Market sentiment: <strong>{avgChange >= 0 ? 'Bullish' : 'Bearish'}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPairPerformance;
