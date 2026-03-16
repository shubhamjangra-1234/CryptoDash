import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { formatPercentage } from '../utils/formatters';
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';

const GlobalPriceComparison = ({ coin, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('all');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Global Price Comparison</CardTitle>
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
          <CardTitle>Global Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading comparison data</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load comparison data'}
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
          <CardTitle>Global Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Multi-currency performance data
  const currencyPerformance = [
    { currency: 'USD', value: coin.priceChange24hUSD, flag: '🇺🇸' },
    { currency: 'INR', value: coin.priceChange24hINR, flag: '🇮🇳' },
    { currency: 'EUR', value: coin.priceChange24hEUR, flag: '🇪🇺' },
    { currency: 'BTC', value: coin.priceChange24hBTC, flag: '₿' },
    { currency: 'ETH', value: coin.priceChange24hETH, flag: 'Ξ' }
  ];

  // Filter currencies based on search
  const filteredCurrencies = currencyPerformance.filter(item => {
    const matchesSearch = item.currency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCurrency === 'all' || item.currency === filterCurrency;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Price Comparison (24h Performance)</CardTitle>
      </CardHeader>
      <CardContent>

        {/* Currency Performance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCurrencies.map((item) => {
            const isPositive = (item.value || 0) >= 0;
            return (
              <div key={item.currency} className="p-4 border border-border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="font-semibold text-foreground">{item.currency}</span>
                  </div>
                  <Badge 
                    variant={isPositive ? "positive" : "destructive"}
                    className="text-xs"
                  >
                    {isPositive ? 'Positive' : 'Negative'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-lg font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{formatPercentage(item.value)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  24h price change in {item.currency}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredCurrencies.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              No currencies found matching "{searchTerm}"
            </div>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => {
                setSearchTerm('');
                setFilterCurrency('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalPriceComparison;
