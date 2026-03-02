import React from 'react';
import DataTable from '../../../shared/components/DataTable';
import { ArrowUpRight, ArrowDownRight, Minus, Eye } from 'lucide-react';
import { formatPrice, formatPercentage, formatMarketCap, formatVolume, formatRank } from '../utils/formatters';

const MarketDataTable = ({ 
  data = [], 
  loading = false, 
  error = null,
  onRowClick = null,
  pagination = null,
  onPaginationChange = null
}) => {
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
        if (!row || !row.symbol) return <span>-</span>;
        return (
          <div className="flex justify-start  items-center space-x-3">
            {row.image && (
              <img 
                src={row.image} 
                alt={row.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${row.symbol}&background=random&color=fff`;
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
      key: 'price',
      title: 'Price',
      sortable: false,
      render: (value) => (
        <div className="text-left">
          <span className="font-medium text-foreground">
            {formatPrice(value)}
          </span>
        </div>
      )
    },
    {
      key: 'change',
      title: '24h %',
      sortable: false,
      render: (value, row) => {
        if (!row) return <span>-</span>;
        
        const changeType = row.changeType || 'neutral';
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
              {formatPercentage(value)}
            </span>
          </div>
        );
      }
    },
    {
      key: 'marketCap',
      title: 'Market Cap',
      sortable: false,
      render: (value) => (
        <div className="text-left">
          <span className="font-medium text-foreground">
            {formatMarketCap(value)}
          </span>
        </div>
      )
    },
    {
      key: 'volume',
      title: 'Volume(24h)',
      sortable: false,
      render: (value) => (
        <div className="text-left">
          <span className="font-medium text-foreground">
            {formatVolume(value)}
          </span>
        </div>
      )
    },
   
    {
      key: 'sparkline',
      title: 'Last 7 Days',
      sortable: false,
      render: (value, row) => {
        if (!row) return <span className="text-muted-foreground">-</span>;
        
        const changeType = row.changeType || 'neutral';
        
        // Bullish SVG (green)
        const BullishIcon = () => (
          <svg viewBox="0 0 48 48" version="1" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 48 48" fill="#000000" className="w-12 h-12">
            <g fill="#4CAF50">
              <rect x="40" y="21" width="4" height="23"></rect>
              <rect x="34" y="28" width="4" height="16"></rect>
              <rect x="28" y="23" width="4" height="21"></rect>
              <rect x="22" y="29" width="4" height="15"></rect>
              <rect x="16" y="32" width="4" height="12"></rect>
              <rect x="10" y="30" width="4" height="14"></rect>
              <rect x="4" y="34" width="4" height="10"></rect>
            </g>
            <g fill="#388E3C">
              <polygon points="40.1,9.1 34,15.2 30,11.2 20,21.2 15,16.2 4.6,26.6 7.4,29.4 15,21.8 20,26.8 30,16.8 34,20.8 42.9,11.9"></polygon>
              <polygon points="44,8 35,8 44,17"></polygon>
            </g>
          </svg>
        );
        
        // Bearish SVG (red)
        const BearishIcon = () => (
          <svg viewBox="-1.4 -1.4 16.80 16.80" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#000000" className="w-12 h-12">
            <g fill="#f44336">
              <path d="M11.8 9.91H13v3h-1.2zM10 8.41h1.2v4.5H10zm-1.8 1.2h1.2v3.3H8.2zm-1.8-2.4h1.2v5.7H6.4zm-1.8.9h1.2v4.8H4.6zm-1.8-1.2H4v6H2.8zM1 5.41h1.2v7.5H1z"></path>
            </g>
            <g fill="#d32f2f">
              <path d="M10 5.35l1.83 1.83.84-.84L10 3.67l-1.2 1.2-3-3-1.5 1.5-2.28-2.28-.84.84L4.3 5.05l1.5-1.5 3 3z"></path>
              <path d="M13 7.51h-2.7L2.7-2.7z"></path>
            </g>
          </svg>
        );
        
        return (
          <div className="flex items-center justify-left">
            {changeType === 'positive' ? (
              <BullishIcon />
            ) : changeType === 'negative' ? (
              <BearishIcon />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center">
                <Minus className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      }
    },
     {
      key: 'actions',
      title: '',
      sortable: false,
      render: (value, row) => {
        if (!row || !row.id) return <span>-</span>;
        
        const handleViewDetails = () => {
          if (row.id) {
            window.location.href = `/coin/${row.id}`;
          }
        };
        
        return (
          <button
            onClick={handleViewDetails}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
          </button>
        );
      }
    },
  ];

  const handleRowClick = (row) => {
    onRowClick?.(row);
  };
return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Market Data</h2>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        emptyMessage="No coins found matching your search criteria"
        errorMessage="Failed to load market data"
      />
    </div>
  );
};

export default MarketDataTable;
