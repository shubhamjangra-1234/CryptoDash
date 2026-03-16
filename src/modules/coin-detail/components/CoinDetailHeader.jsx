import {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { formatPrice, formatMarketCap, formatPercentage, formatNumber } from '../utils/formatters';
import { TrendingUp, TrendingDown, Globe, ExternalLink } from 'lucide-react';

const CoinDetailHeader = ({ coin, loading, error }) => {
  const [selectedImageSize, setSelectedImageSize] = useState('large');
  const [showImageGallery, setShowImageGallery] = useState(false);

  if (loading) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-6 bg-muted rounded w-1/2 mb-2" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading coin data</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load coin details'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coin) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-muted-foreground">Coin not found</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = (coin.priceChange24h || 0) >= 0;

  // Get the best available image URL
  const getImageUrl = (size = 'large') => {
    if (coin.image && typeof coin.image === 'object') {
      return coin.image[size] || coin.image.large || coin.image.small || coin.image.thumb || '/placeholder-coin.png';
    }
    return coin.image || '/placeholder-coin.png';
  };

  // Performance metrics data
  const performanceMetrics = [
    { label: '1H', value: coin.priceChange1h, key: 'priceChange1h' },
    { label: '24H', value: coin.priceChange24h, key: 'priceChange24h' },
    { label: '7D', value: coin.priceChange7d, key: 'priceChange7d' },
    { label: '14D', value: coin.priceChange14d, key: 'priceChange14d' },
    { label: '30D', value: coin.priceChange30d, key: 'priceChange30d' },
    { label: '200D', value: coin.priceChange200d, key: 'priceChange200d' },
    { label: '1Y', value: coin.priceChange1y, key: 'priceChange1y' }
  ];

  // Supply percentage calculation
  const supplyPercentage = coin.totalSupply > 0 ? 
    (coin.circulatingSupply / coin.maxSupply) * 100 : 0;

  return (
    <Card className="shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Section - Coin Info */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src={getImageUrl(selectedImageSize)}
                alt={coin.name}
                className="w-12 h-12 rounded-full object-cover border border-border cursor-pointer transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/placeholder-coin.png';
                }}
                onClick={() => setShowImageGallery(!showImageGallery)}
              />
              <div className="absolute -bottom-1 -right-1">
                <Badge 
                  variant={isPositive ? "default" : "destructive"}
                  className="text-xs font-bold text-[10px]"
                >
                  #{coin.rank || 'N/A'}
                </Badge>
              </div>
              {/* Hover indicator */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {coin.name}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-mono text-muted-foreground">
                  {coin.symbol}
                </span>
                <Badge variant="outline" className="text-xs">
                  {coin.symbol}
                </Badge>
              </div>
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="font-medium">
                  {isPositive ? '+' : ''}{formatPercentage(coin.priceChange24h)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Price Stats */}
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Current Price</div>
              <div className="text-3xl font-bold text-foreground">
                {formatPrice(coin.currentPrice)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-right">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
                <div className="text-lg font-semibold text-foreground">
                  {formatMarketCap(coin.marketCap)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
                <div className="text-lg font-semibold text-foreground">
                  {formatMarketCap(coin.totalVolume)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics Graph */}
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
          <div className="relative p-2 w-full h-32 bg-card rounded-lg border border-border overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 128"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="performanceGrid" width="80" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              
              {/* Background grid */}
              <rect width="800" height="128" fill="url(#performanceGrid)" />
              
              {/* Zero line */}
              <line
                x1="40"
                y1="64"
                x2="760"
                y2="64"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="4,4"
              />
              
              {/* Performance line */}
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={isPositive ? "text-green-500" : "text-red-500"}
                strokeLinejoin="round"
                strokeLinecap="round"
                points={performanceMetrics.map((metric, index) => {
                  const x = 40 + (index / (performanceMetrics.length - 1)) * 720;
                  const value = metric.value || 0;
                  // Scale: -20% to +20% mapped to chart height
                  const scaledValue = Math.max(-20, Math.min(20, value));
                  const y = 64 - (scaledValue / 20) * 56; // 56 = 128/2 - 8 padding
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Data points */}
              {performanceMetrics.map((metric, index) => {
                const x = 40 + (index / (performanceMetrics.length - 1)) * 720;
                const value = metric.value || 0;
                const scaledValue = Math.max(-20, Math.min(20, value));
                const y = 64 - (scaledValue / 20) * 56;
                const isMetricPositive = value >= 0;
                
                return (
                  <g key={metric.key}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="currentColor"
                      className={isMetricPositive ? "text-green-500" : "text-red-500"}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="2"
                      fill="white"
                    />
                    {/* Label */}
                    <text
                      x={x}
                      y="120"
                      textAnchor="middle"
                      className="text-xs fill-muted-foreground font-medium"
                    >
                      {metric.label}
                    </text>
                    {/* Value */}
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      className={`text-xs font-bold ${isMetricPositive ? 'fill-green-500' : 'fill-red-500'}`}
                    >
                      {isMetricPositive ? '+' : ''}{formatPercentage(value)}
                    </text>
                  </g>
                );
              })}
              
              {/* Y-axis labels */}
              <text x="30" y="12" textAnchor="end" className="text-xs fill-muted-foreground">+20%</text>
              <text x="30" y="68" textAnchor="end" className="text-xs fill-muted-foreground">0%</text>
              <text x="30" y="124" textAnchor="end" className="text-xs fill-muted-foreground">-20%</text>
            </svg>
          </div>
        </div>

        {/* Supply Visualization */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-foreground">Supply Metrics</h3>
            <div className="text-sm text-muted-foreground">
              {formatNumber(coin.circulatingSupply)} / {formatNumber(coin.maxSupply)}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(supplyPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Circulating Supply</span>
            <span>{formatPercentage(supplyPercentage)}</span>
            <span>Max Supply</span>
          </div>
        </div>

        {/* Image Gallery Section */}
        {showImageGallery && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-foreground">Coin Images</h3>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                Hide
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {coin.image && typeof coin.image === 'object' ? (
                <>
                  {['thumb', 'small', 'large'].map((size) => (
                    <div key={size} className="bg-card rounded border border-border p-2">
                      <div className="text-center">
                        <div className="text-[10px] font-medium text-foreground mb-1 capitalize">
                          {size}
                        </div>
                        <div className="relative inline-block">
                          <img
                            src={getImageUrl(size)}
                            alt={`${coin.name} ${size} image`}
                            className={`rounded object-cover border border-border ${
                              size === 'thumb' ? 'w-8 h-8' : 
                              size === 'small' ? 'w-10 h-10' : 'w-12 h-12'
                            }`}
                            onError={(e) => {
                              e.target.src = '/placeholder-coin.png';
                            }}
                          />
                          {selectedImageSize === size && (
                            <div className="absolute inset-0 rounded border border-blue-500 pointer-events-none" />
                          )}
                        </div>
                        <div className="mt-1">
                          <button
                            onClick={() => setSelectedImageSize(size)}
                            className={`px-1 py-0.5 text-[8px] rounded transition-colors ${
                              selectedImageSize === size
                                ? 'bg-blue-500 text-white'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {selectedImageSize === size ? '✓' : 'Use'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-3 text-center text-muted-foreground text-[10px]">
                  No additional images
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {/* Market Cap Rank */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">Market Cap Rank</h4>
              <div className="text-xs text-muted-foreground">Position</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                #{coin.market_cap_rank || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                {coin.market_cap_rank_with_rehypothecated && 
                 `(#${coin.market_cap_rank_with_rehypothecated} w/ rehypothecated)`
                }
              </div>
            </div>
          </div>

          {/* Sentiment Score */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">Community Sentiment</h4>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600">👍 Positive</span>
                <span className="text-sm font-bold text-green-600">{coin.sentiment_votes_up_percentage || 0}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${coin.sentiment_votes_up_percentage || 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-600">👎 Negative</span>
                <span className="text-sm font-bold text-red-600">{coin.sentiment_votes_down_percentage || 0}%</span>
              </div>
            </div>
          </div>

          {/* Watchlist Stats */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">Watchlist Users</h4>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(coin.watchlist_portfolio_users || 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                users watching
              </div>
            </div>
          </div>


          {/* Platform Info */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">Platform</h4>
              <div className="text-xs text-muted-foreground">Asset</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Platform:</span>
                <span className="text-xs font-medium capitalize">{coin.asset_platform_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Web Slug:</span>
                <span className="text-xs font-medium">{coin.web_slug || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Preview Status */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">Listing Status</h4>
              <div className="text-xs text-muted-foreground">Info</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={coin.preview_listing ? "default" : "secondary"}>
                {coin.preview_listing ? 'Preview' : 'Official'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {coin.preview_listing ? 'In preview listing' : 'Officially listed'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinDetailHeader;
