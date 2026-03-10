import React from 'react';
import { TrendingUp, TrendingDown, Minus, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CategoryCoinsTable = ({ coins = [] }) => {
  const columns = [
    {
      key: 'rank',
      title: '#',
      sortable: false,
      render: (value) => (
        <div className="text-left w-8">
          <span className="text-muted-foreground font-medium text-sm">
            {value || '-'}
          </span>
        </div>
      )
    },
    {
      key: 'name',
      title: 'Coin',
      sortable: false,
      render: (value, row) => {
        if (!row) return <span>-</span>;
        return (
          <div className="flex justify-start items-center space-x-3">
            {row.image && (
              <img 
                src={row.image} 
                alt={row.name}
                className="w-8 h-8 rounded-full border border-border"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${row.symbol}&background=random&color=fff&size=32`;
                }}
              />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{value || '-'}</span>
              <span className="text-sm text-muted-foreground">{row.symbol}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'current_price',
      title: 'Price',
      sortable: false,
      render: (value) => (
        <div className="text-left">
          <span className="font-medium text-foreground">
            {value || '-'}
          </span>
        </div>
      )
    },
    {
      key: 'price_change_percentage_24h',
      title: '24h %',
      sortable: false,
      render: (value, row) => {
        if (!row) return <span>-</span>;
        
        const changeType = row.changeColor || 'neutral';
        const Icon = changeType === 'positive' ? ArrowUpRight : 
                    changeType === 'negative' ? ArrowDownRight : Minus;
        
        return (
          <div className="flex items-center justify-start space-x-1">
            <Icon className={`h-4 w-4 ${
              changeType === 'positive' ? 'text-green-500' : 
              changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground'
            }`} />
            <span className={`font-medium ${
              changeType === 'positive' ? 'text-green-500' : 
              changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {row.formattedChange || '0.00%'}
            </span>
          </div>
        );
      }
    },
    {
      key: 'market_cap',
      title: 'Market Cap',
      sortable: false,
      render: (value) => (
        <div className="text-left">
          <span className="font-medium text-foreground">
            {value || '-'}
          </span>
        </div>
      )
    },
    {
      key: 'total_volume',
      title: 'Volume (24h)',
      sortable: false,
      render: (value) => (
        <div className="text-left">
          <span className="font-medium text-foreground">
            {value || '-'}
          </span>
        </div>
      )
    },
    {
      key: 'circulating_supply',
      title: 'Circulating Supply',
      sortable: false,
      render: (value, row) => (
        <div className="text-left">
          <span className="font-medium text-foreground">
            {value ? value.toLocaleString() : '-'}
            {row.symbol && ` ${row.symbol.toUpperCase()}`}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      title: '',
      sortable: false,
      render: (value, row) => {
        if (!row || !row.id) return <span>-</span>;
        
        const handleViewDetails = () => {
          window.location.href = `/coin/${row.id}`;
        };
        
        return (
          <button
            onClick={handleViewDetails}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
          </button>
        );
      }
    },
  ];

  if (coins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">
          No coins found in this category
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coins.map((row, index) => (
              <tr
                key={row.id || index}
                className="hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => {
                  if (row.id) {
                    window.location.href = `/coin/${row.id}`;
                  }
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm"
                  >
                    {column.render ? column.render(row[column.key], row, index) : row[column.key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryCoinsTable;
