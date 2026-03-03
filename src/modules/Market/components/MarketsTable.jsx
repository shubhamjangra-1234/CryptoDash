import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { Eye } from 'lucide-react';
const MarketsTable = ({ data, loading, error, onRowClick }) => {
  console.log("Data",data);
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No market data available
      </div>
    );
  }

  const renderChangeIcon = (change) => {
    if (change > 0) return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
    return <MinusIcon className="w-4 h-4 text-gray-400" />;
  };

  const renderChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left text-nowrap py-3 px-4 font-medium text-sm">Name</th>
            <th className="text-left text-nowrap py-3 px-4 font-medium text-sm">Price</th>
            <th className="text-left text-nowrap py-3 px-4 font-medium text-sm">24h Change</th>
            <th className="text-left text-nowrap py-3 px-4 font-medium text-sm">Market Cap</th>
            <th className="text-left text-nowrap py-3 px-4 font-medium text-sm">Volume (24h)</th>
            <th className="text-left text-nowrap py-3 px-4 font-medium text-sm">Circulating Supply</th>
            <th className="text-left text-nowrap py-3 px-4 font-medium text-sm">More</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin) => (
            <tr
              key={coin.id}
              className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onRowClick(coin)}
            >
              <td className="py-3 px-4">
                <div className="flex items-center justify-start space-x-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-[10px] text-muted-foreground">{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-left font-medium">
                ${coin.currentPrice?.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-left">
                <div className={`flex items-center justify-end space-x-1 ${renderChangeColor(coin.priceChangePercentage24h)}`}>
                  {renderChangeIcon(coin.priceChangePercentage24h)}
                  <span className="font-medium">
                    {Math.abs(coin.priceChangePercentage24h?.toFixed(2) || 0)}%
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-left font-medium">
                {formatCurrency(coin.marketCap)}
              </td>
              <td className="py-3 px-4 text-left font-medium">
                {formatCurrency(coin.totalVolume)}
              </td>
              <td className="py-3 px-4 text-left font-medium">
                {coin.circulatingSupply?.toLocaleString()} {coin.symbol.toUpperCase()}
              </td>
              <td className="py-3 px-4 text-left font-medium">
                <Eye className="w-4 h-4 text-muted-foreground"/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketsTable;
