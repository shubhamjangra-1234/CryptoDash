import React from 'react';

export const CRYPTO_COLUMNS = [
  {
    key: 'market_cap_rank',
    title: '#',
    width: 'w-16',
    sortable: true,
    render: (value) => React.createElement('span', { className: 'text-muted-foreground font-medium' }, `#${value}`)
  },
  {
    key: 'name',
    title: 'Coin',
    width: 'flex-1',
    sortable: true,
    render: (value, row) => React.createElement('div', { className: 'flex items-center space-x-3' }, [
      React.createElement('img', {
        key: 'img',
        src: row.image,
        alt: row.name,
        className: 'w-8 h-8 rounded-full',
        onError: (e) => { e.target.src = '/placeholder-coin.png'; }
      }),
      React.createElement('div', { key: 'info', className: '' }, [
        React.createElement('div', { key: 'name', className: 'font-medium text-foreground' }, value),
        React.createElement('div', { key: 'symbol', className: 'text-sm text-muted-foreground uppercase' }, row.symbol)
      ])
    ])
  },
  {
    key: 'current_price',
    title: 'Price',
    width: 'w-32',
    sortable: true,
    render: (value) => React.createElement('span', { className: 'font-medium text-foreground' }, 
      value ? `$${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      })}` : 'N/A'
    )
  },
  {
    key: 'market_cap',
    title: 'Market Cap',
    width: 'w-40',
    sortable: true,
    render: (value) => React.createElement('span', { className: 'font-medium text-foreground' }, 
      value ? `$${(value / 1e9).toFixed(2)}B` : 'N/A'
    )
  },
  {
    key: 'price_change_percentage_24h',
    title: '24h %',
    width: 'w-24',
    sortable: true,
    render: (value) => {
      const isPositive = value > 0;
      const isNegative = value < 0;
      const isNeutral = value === 0;
      
      return React.createElement('div', { className: 'flex items-center space-x-1' }, [
        isPositive && React.createElement('svg', {
          key: 'up',
          className: 'h-3 w-3 text-green-500',
          fill: 'currentColor',
          viewBox: '0 0 20 20'
        }, React.createElement('path', {
          fillRule: 'evenodd',
          d: 'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z',
          clipRule: 'evenodd'
        })),
        isNegative && React.createElement('svg', {
          key: 'down',
          className: 'h-3 w-3 text-red-500',
          fill: 'currentColor',
          viewBox: '0 0 20 20'
        }, React.createElement('path', {
          fillRule: 'evenodd',
          d: 'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z',
          clipRule: 'evenodd'
        })),
        React.createElement('span', {
          key: 'value',
          className: `font-medium ${
            isPositive ? 'text-green-500' : 
            isNegative ? 'text-red-500' : 
            'text-muted-foreground'
          }`
        }, value !== null && value !== undefined ? 
          `${value >= 0 ? '+' : ''}${value.toFixed(2)}%` : 
          'N/A'
        )
      ]);
    }
  },
  {
    key: 'total_volume',
    title: 'Volume',
    width: 'w-32',
    sortable: true,
    render: (value) => React.createElement('span', { className: 'text-muted-foreground' }, 
      value ? `$${(value / 1e9).toFixed(2)}B` : 'N/A'
    )
  },
  {
    key: 'actions',
    title: 'Actions',
    width: 'w-24',
    sortable: false,
    render: (_, row) => React.createElement('button', {
      onClick: () => window.location.href = `/coins/${row.id}`,
      className: 'text-sm text-primary hover:text-primary/80 font-medium'
    }, 'View')
  }
];

export const SORT_OPTIONS = [
  { key: 'market_cap_desc', label: 'Market Cap (High to Low)' },
  { key: 'market_cap_asc', label: 'Market Cap (Low to High)' },
  { key: 'price_desc', label: 'Price (High to Low)' },
  { key: 'price_asc', label: 'Price (Low to High)' },
  { key: 'volume_desc', label: 'Volume (High to Low)' },
  { key: 'volume_asc', label: 'Volume (Low to High)' },
  { key: 'change_desc', label: '24h Change (High to Low)' },
  { key: 'change_asc', label: '24h Change (Low to High)' }
];

export const CURRENCY_OPTIONS = [
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'eur', label: 'EUR', symbol: '€' },
  { value: 'gbp', label: 'GBP', symbol: '£' },
  { value: 'jpy', label: 'JPY', symbol: '¥' }
];

export const TIME_PERIODS = [
  { value: 1, label: '24 Hours' },
  { value: 7, label: '7 Days' },
  { value: 30, label: '30 Days' },
  { value: 90, label: '90 Days' },
  { value: 365, label: '1 Year' }
];
