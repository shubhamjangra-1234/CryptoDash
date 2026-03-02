import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import ChangeBadge from '../../../shared/components/ChangeBadge';
import { formatCurrency, formatNumber } from '../utils/formatters';

const CoinOverviewCard = React.memo(({ coin, loading = false, error = null }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading coin data</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coin) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>No coin data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <img 
            src={coin.image} 
            alt={coin.name}
            className="h-16 w-16 rounded-full"
          />
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {coin.name}
              <Badge variant="secondary">{coin.symbol}</Badge>
              {coin.marketCapRank && (
                <Badge variant="outline">#{coin.marketCapRank}</Badge>
              )}
            </CardTitle>
            {coin.categories && coin.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {coin.categories.slice(0, 3).map((category) => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {coin.categories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{coin.categories.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-2xl font-bold">
              {formatCurrency(coin.marketData?.currentPrice)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">24h Change</p>
            <div className="flex items-center gap-2">
              <ChangeBadge 
                value={coin.marketData?.priceChangePercentage24h} 
                type="percentage" 
              />
              <span className="text-sm text-gray-500">
                ({formatCurrency(coin.marketData?.priceChange24h)})
              </span>
            </div>
          </div>
        </div>

        {/* Market Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Market Cap</p>
            <p className="font-medium">
              {formatCurrency(coin.marketData?.marketCap)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Volume (24h)</p>
            <p className="font-medium">
              {formatCurrency(coin.marketData?.totalVolume)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Circulating Supply</p>
            <p className="font-medium">
              {formatNumber(coin.marketData?.circulatingSupply)} {coin.symbol}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Max Supply</p>
            <p className="font-medium">
              {coin.marketData?.maxSupply 
                ? formatNumber(coin.marketData.maxSupply)
                : '∞'
              } {coin.symbol}
            </p>
          </div>
        </div>

        {/* High/Low Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">24h High</p>
            <p className="font-medium">
              {formatCurrency(coin.marketData?.high24h)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">24h Low</p>
            <p className="font-medium">
              {formatCurrency(coin.marketData?.low24h)}
            </p>
          </div>
        </div>

        {/* ATH Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">All Time High</p>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {formatCurrency(coin.marketData?.ath)}
              </span>
              <ChangeBadge 
                value={coin.marketData?.athChangePercentage} 
                type="percentage" 
              />
            </div>
            {coin.marketData?.athDate && (
              <p className="text-xs text-gray-500">
                {new Date(coin.marketData.athDate).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div>
            <p className="text-sm text-gray-600">All Time Low</p>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {formatCurrency(coin.marketData?.atl)}
              </span>
              <ChangeBadge 
                value={coin.marketData?.atlChangePercentage} 
                type="percentage" 
              />
            </div>
            {coin.marketData?.atlDate && (
              <p className="text-xs text-gray-500">
                {new Date(coin.marketData.atlDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CoinOverviewCard.displayName = 'CoinOverviewCard';

export default CoinOverviewCard;
