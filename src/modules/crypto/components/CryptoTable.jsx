import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CRYPTO_COLUMNS, SORT_OPTIONS, CURRENCY_OPTIONS } from '../constants/cryptoColumns';
import { ChangeBadge } from './CryptoCard';
import { Search, ArrowUpDown, RefreshCw } from 'lucide-react';

// Crypto Table Component
export const CryptoTable = ({ 
  data = [], 
  isLoading = false, 
  onSort, 
  onRefresh,
  onViewDetails,
  currency = 'usd',
  sortBy = 'market_cap_desc'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('market_cap');

  // Filter data based on search term
  const filteredData = data.filter(crypto => 
    crypto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle column sort
  const handleColumnSort = (columnKey) => {
    const newSortBy = SORT_OPTIONS.find(option => 
      option.key.includes(columnKey) && 
      (option.key.includes('desc') || option.key.includes('asc'))
    )?.key || 'market_cap_desc';
    
    setSortColumn(columnKey);
    onSort?.(newSortBy);
  };

  // Get sort direction for column
  const getSortDirection = (columnKey) => {
    if (sortBy.includes(columnKey)) {
      return sortBy.includes('desc') ? 'desc' : 'asc';
    }
    return null;
  };

  if (isLoading) {
    return <CryptoTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Cryptocurrency Market</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={currency} onValueChange={(value) => onSort?.(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="border-b">
                {CRYPTO_COLUMNS.map((column) => (
                  <th 
                    key={column.key}
                    className={`text-left p-3 font-medium text-sm text-muted-foreground ${column.width}`}
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleColumnSort(column.key)}
                        className="flex items-center space-x-1 h-auto p-0 font-medium"
                      >
                        <span>{column.title}</span>
                        {getSortDirection(column.key) && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </Button>
                    ) : (
                      column.title
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((crypto, index) => (
                <tr 
                  key={crypto.id || index}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  {CRYPTO_COLUMNS.map((column) => (
                    <td 
                      key={column.key}
                      className={`p-3 text-sm ${column.width}`}
                    >
                      {column.render ? 
                        column.render(crypto[column.key], crypto) : 
                        crypto[column.key] || 'N/A'
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? 'No cryptocurrencies found matching your search.' : 'No data available.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Crypto Table Skeleton Loader
const CryptoTableSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex space-x-4">
          <div className="h-10 flex-1 max-w-sm bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {CRYPTO_COLUMNS.map((column) => (
                  <th key={column.key} className={`text-left p-3 ${column.width}`}>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, index) => (
                <tr key={index} className="border-b">
                  {CRYPTO_COLUMNS.map((column) => (
                    <td key={column.key} className={`p-3 ${column.width}`}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Crypto Grid View Component
export const CryptoGrid = ({ 
  data = [], 
  isLoading = false, 
  onViewDetails 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="h-64 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((crypto) => (
        <div key={crypto.id} className="hover-lift transition-subtle">
          <div className="p-6 border rounded-xl space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={crypto.image} 
                alt={crypto.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.target.src = '/placeholder-coin.png';
                }}
              />
              <div>
                <h3 className="font-medium">{crypto.name}</h3>
                <p className="text-sm text-muted-foreground uppercase">{crypto.symbol}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                ${crypto.current_price?.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                }) || 'N/A'}
              </div>
              <ChangeBadge value={crypto.price_change_percentage_24h} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">MCap</p>
                <p className="font-medium">
                  ${crypto.market_cap ? (crypto.market_cap / 1e9).toFixed(2) + 'B' : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-medium">
                  ${crypto.total_volume ? (crypto.total_volume / 1e9).toFixed(2) + 'B' : 'N/A'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => onViewDetails(crypto.id)}
              variant="outline" 
              className="w-full"
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoTable;
