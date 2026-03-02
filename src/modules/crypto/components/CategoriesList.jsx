import React, { useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import ChangeBadge from '../../../shared/components/ChangeBadge';
import { formatCurrency, formatNumber } from '../utils/formatters';

const CategoriesList = React.memo(({ 
  data = [], 
  loading = false, 
  error = null,
  onCategoryClick = null 
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'marketCap',
    direction: 'desc'
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
      key: 'name',
      title: 'Category',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.content && (
            <div className="text-sm text-gray-500 mt-1">
              {row.content.substring(0, 100)}...
            </div>
          )}
        </div>
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
      key: 'marketCapChange24h',
      title: 'Market Cap Change (24h)',
      sortable: true,
      render: (value) => (
        <ChangeBadge value={value} type="currency" />
      )
    },
    {
      key: 'volume24h',
      title: 'Volume (24h)',
      sortable: true,
      render: (value) => (
        <span className="font-medium">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'volumeChange24h',
      title: 'Volume Change (24h)',
      sortable: true,
      render: (value) => (
        <ChangeBadge value={value} type="currency" />
      )
    },
    {
      key: 'top3Coins',
      title: 'Top Coins',
      sortable: false,
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value && value.slice(0, 3).map((coin, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {coin}
            </span>
          ))}
          {value && value.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              +{value.length - 3}
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={sortedData}
      columns={columns}
      loading={loading}
      error={error}
      onRowClick={onCategoryClick}
      sorting={{
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        onSort: handleSort
      }}
      className="w-full"
    />
  );
});

CategoriesList.displayName = 'CategoriesList';

export default CategoriesList;
