import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { formatNumber, formatMarketCap, formatPrice, formatPercentage } from '../utils/formatters';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Eye } from 'lucide-react';

const CoinMarketStats = ({ coin, loading, error }) => {
  // Debug logging to see all data
  console.log('=== CoinMarketStats Debug ===');
  console.log('Full coin object:', coin);
  console.log('coin.market_data:', coin.market_data);
  console.log('coin.current_price:', coin.current_price);
  console.log('coin.total_volume:', coin.total_volume);
  console.log('coin.market_cap:', coin.market_cap);
  console.log('Available keys:', Object.keys(coin || {}));
  console.log('==========================');
  // Major currencies with flags
  const majorCurrencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
    { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' }
  ];

  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Debug currency changes
  const handleCurrencyChange = (currency) => {
    console.log('=== Currency Change Debug ===');
    console.log('New currency:', currency);
    console.log('Available total_volume fields:', {
      'total_volume_usd': coin.total_volume_usd,
      'total_volume_inr': coin.total_volume_inr,
      'total_volume_btc': coin.total_volume_btc,
      'totalVolume': coin.totalVolume
    });
    console.log('Available current_price fields:', {
      'current_price_usd': coin.current_price_usd,
      'current_price_inr': coin.current_price_inr,
      'current_price_btc': coin.current_price_btc,
      'currentPrice': coin.currentPrice
    });
    setSelectedCurrency(currency);
  };

  // Dynamic currency stats function - using marketData object for currency flexibility
  const getCurrencyStats = (currency) => {
    const lowerCurrency = currency.toLowerCase();
    const marketData = coin.marketData || {};

    return [
      {
        title: `Current Price (${currency})`,
        value: marketData.current_price?.[lowerCurrency] || 0,
        icon: <DollarSign className="w-4 h-4" />,
        change: null,
        format: 'price'
      },
      {
        title: `Total Volume (${currency})`,
        value: marketData.total_volume?.[lowerCurrency] || 0,
        icon: <Activity className="w-4 h-4" />,
        change: null,
        format: 'marketCap'
      },
      {
        title: `24h High (${currency})`,
        value: marketData.high_24h?.[lowerCurrency] || 0,
        icon: <TrendingUp className="w-4 h-4" />,
        change: null,
        format: 'price'
      },
      {
        title: `24h Low (${currency})`,
        value: marketData.low_24h?.[lowerCurrency] || 0,
        icon: <TrendingDown className="w-4 h-4" />,
        change: null,
        format: 'price'
      },
      {
        title: `Market Cap`,
        value: marketData.market_cap_change_24h || 0,
        icon: <DollarSign className="w-4 h-4" />,
        change: marketData.market_cap_change_percentage_24h || 0,
        format: 'marketCap'
      },
      {
        title: `24h Change`,
        value: marketData.price_change_24h || 0,
        icon: <Activity className="w-4 h-4" />,
        change: marketData.price_change_percentage_24h || 0,
        format: 'price'
      }
    ];
  };

  const currencyStats = getCurrencyStats(selectedCurrency);



  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  console.log(coin.totalVolume)
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading market stats</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load market statistics'}
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
          <CardTitle>Market Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">No market statistics available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const marketStats = [
    {
      title: 'Market Cap Rank',
      value: coin.market_cap_rank || 'N/A',
      icon: <TrendingUp className="w-4 h-4" />,
      change: null,
      format: 'number'
    },
    {
      title: 'Market Cap',
      value: coin.marketCap || 0,
      icon: <DollarSign className="w-4 h-4" />,
      change: coin.marketCapChangePercentage24h || 0,
      format: 'marketCap'
    },
    {
      title: 'Total Volume (24h)',
      value: coin.totalVolume || 0,
      icon: <Activity className="w-4 h-4" />,
      change: null,
      format: 'marketCap'
    },
    {
      title: 'Watchlist Users',
      value: coin.watchlist_portfolio_users || 0,
      icon: <Users className="w-4 h-4" />,
      change: null,
      format: 'number'
    },
    {
      title: 'Sentiment Score',
      value: coin.sentiment_votes_up_percentage || 0,
      icon: <Eye className="w-4 h-4" />,
      change: null,
      format: 'percentage'
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'marketCap':
        return formatMarketCap(value);
      case 'price':
        return formatPrice(value);
      case 'percentage':
        return `${value}%`;
      case 'price':
        return `${value}`;
      case 'number':
      default:
        return formatNumber(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-muted-foreground" />
            Market Statistics
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Currency:</label>
            <select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="px-3 py-1 border rounded-md bg-background text-sm"
            >
              {majorCurrencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currencyStats.map((stat, index) => {
            const isPositive = stat.change !== null && stat.change >= 0;
            return (
              <div key={index} className="p-4 border border-border rounded-lg bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-muted-foreground">
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{stat.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    {formatValue(stat.value, stat.format)}
                  </span>
                  {stat.change !== null && (
                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{stat.change.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinMarketStats;
