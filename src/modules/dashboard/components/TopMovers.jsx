import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatPercentage } from '../utils/formatters';

const TopMovers = ({ 
  data = {}, 
  loading = false, 
  error = null,
  onCoinClick = null
}) => {
  const renderCoinList = (coins, type) => {
    if (!coins || coins.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No {type} data available
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {coins.map((coin, index) => (
          <div
            key={coin.id || index}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onCoinClick?.(coin)}
          >
            <div className="flex items-center space-x-3">
              {coin.image && (
                <img 
                  src={coin.image} 
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=random&color=fff`;
                  }}
                />
              )}
              <div>
                <div className="font-medium">{coin.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatPrice(coin.price)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                coin.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatPercentage(coin.change)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-500">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Gainers (Error)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-red-500 py-8">
              Failed to load gainers data
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-500">
              <TrendingDown className="h-5 w-5 mr-2" />
              Top Losers (Error)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-red-500 py-8">
              Failed to load losers data
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Top Gainers (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            renderCoinList(data.gainers, 'gainers')
          )}
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
            Top Losers (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            renderCoinList(data.losers, 'losers')
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TopMovers;
