import React, { useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import { Badge } from '../../../components/ui/badge';
import { formatNumber } from '../utils/formatters';

const ExchangeTable = React.memo(({ 
  data = [], 
  loading = false, 
  error = null,
  onExchangeClick = null 
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'trustScoreRank',
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

  const getTrustScoreColor = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    if (score >= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrustScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  const columns = [
    {
      key: 'trustScoreRank',
      title: 'Rank',
      width: '80px',
      sortable: true,
      render: (value) => (
        <span className="text-gray-500 font-medium">#{value}</span>
      )
    },
    {
      key: 'name',
      title: 'Exchange',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.image} 
            alt={value}
            className="w-8 h-8 rounded"
          />
          <div>
            <div className="font-medium">{value}</div>
            {row.country && (
              <div className="text-sm text-gray-500">{row.country}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'trustScore',
      title: 'Trust Score',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Badge className={getTrustScoreColor(value)}>
            {getTrustScoreLabel(value)}
          </Badge>
          <span className="text-sm text-gray-500">({value}/10)</span>
        </div>
      )
    },
    {
      key: 'yearEstablished',
      title: 'Founded',
      sortable: true,
      render: (value) => (
        <span className="font-medium">
          {value || 'Unknown'}
        </span>
      )
    },
    {
      key: 'tradeVolume24hBtcNormalized',
      title: 'Volume (24h)',
      sortable: true,
      render: (value) => (
        <div>
          <span className="font-medium">
            {formatNumber(value)} BTC
          </span>
        </div>
      )
    },
    {
      key: 'hasTradingIncentive',
      title: 'Trading Incentive',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )
    },
    {
      key: 'url',
      title: 'Website',
      sortable: false,
      render: (value) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={(e) => e.stopPropagation()}
        >
          Visit
        </a>
      )
    }
  ];

  return (
    <DataTable
      data={sortedData}
      columns={columns}
      loading={loading}
      error={error}
      onRowClick={onExchangeClick}
      sorting={{
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        onSort: handleSort
      }}
      className="w-full"
    />
  );
});

ExchangeTable.displayName = 'ExchangeTable';

export default ExchangeTable;
