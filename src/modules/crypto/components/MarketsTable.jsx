import React, { useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import ChangeBadge from '../../../shared/components/ChangeBadge';
import { formatCurrency, formatNumber } from '../utils/formatters';

const MarketsTable = React.memo(({ 
  data = [], 
  loading = false, 
  error = null,
  onRowClick = null 
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'marketCapRank',
    direction: 'asc'
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!data) return [];
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }, [data, sortConfig]);

  const columns = [
    {
      key: 'marketCapRank',
      title: '#',
      width: '60px',
      sortable: true,
      render: (value) => (
        <span className="text-gray-500 font-medium">#{value}</span>
      )
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.image} 
            alt={value}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.symbol}</div>
          </div>
        </div>
      )
    },
    {
      key: 'currentPrice',
      title: 'Price',
      sortable: true,
      render: (value) => (
        <span className="font-medium">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'priceChangePercentage24h',
      title: '24h %',
      sortable: true,
      render: (value) => (
        <ChangeBadge value={value} type="percentage" />
      )
    },
    {
      key: 'marketCap',
      title: 'Market Cap',
      sortable: true,
      render: (value) => (
        <span className="font-medium">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'totalVolume',
      title: 'Volume (24h)',
      sortable: true,
      render: (value) => (
        <span className="font-medium">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'circulatingSupply',
      title: 'Circulating Supply',
      sortable: true,
      render: (value, row) => (
        <div>
          <span className="font-medium">
            {formatNumber(value)}
          </span>
          {row.symbol && (
            <span className="text-gray-500 ml-1">{row.symbol}</span>
          )}
        </div>
      )
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleTimeString()}
        </span>
      )
    }
  ];

  return (
    <DataTable
      data={sortedData}
      columns={columns}
      loading={loading}
      error={error}
      onRowClick={onRowClick}
      sorting={{
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        onSort: handleSort
      }}
      className="w-full"
    />
  );
});

MarketsTable.displayName = 'MarketsTable';

export default MarketsTable;
