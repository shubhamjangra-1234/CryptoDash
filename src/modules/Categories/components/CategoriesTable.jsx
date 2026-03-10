import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { SimplePagination } from '../../../components/ui/Pagination';

// Utility function for currency formatting
const formatCurrency = (value) => {
  if (!value || value === 0) return "$0";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const CategoriesTable = ({ 
  categories = [], 
  loading = false, 
  error = null,
  onCategoryClick = null
}) => {
  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCategories = categories.slice(startIndex, endIndex);

    return {
      currentPage,
      totalPages,
      totalItems: categories.length,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, categories.length),
      items: paginatedCategories,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  }, [categories, currentPage]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && paginationData.hasNext) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && paginationData.hasPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleGoToPage = (page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };
  const columns = [
    {
      key: 'name',
      title: 'Category',
      sortable: false,
      render: (value, row) => {
        if (!row) return <span>-</span>;
        return (
          <div className="flex justify-start items-center space-x-3">
            <div className="flex flex-col">
              <span className="font-medium text-nowrap text-foreground">{value || '-'}</span>
            </div>
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
            {formatCurrency(value || 0)}
          </span>
        </div>
      )
    },
    {
      key: 'market_cap_change_24h',
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
            <span className={`font-medium text-nowrap ${
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
      key: 'volume_24h',
      title: 'Volume (24h)',
      sortable: false,
      render: (value) => (
        <div className="text-left">
          <span className="font-medium text-nowrap text-foreground">
            {formatCurrency(value || 0)}
          </span>
        </div>
      )
    },
    {
      key: 'dominance',
      title: 'Dominance',
      sortable: false,
      render: (value) => (
        <div className="text-left">
          <span className="font-medium text-nowrap text-foreground">
            {value ? `${value.toFixed(2)}%` : '0.00%'}
          </span>
        </div>
      )
    },
    {
      key: 'top_3_coins',
      title: 'Top Coins',
      sortable: false,
      render: (value, row) => {
        if (!row || !row.top_3_coins || row.top_3_coins.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        
        return (
          <div className="flex items-center space-x-2">
            {row.top_3_coins.slice(0, 3).map((coinImage, index) => (
              <img
                key={index}
                src={coinImage}
                alt={`Top coin ${index + 1}`}
                className="w-6 h-6 rounded-full border border-border"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${row.top_3_coins_id?.[index] || 'coin'}&background=random&color=fff&size=24`;
                }}
                title={row.top_3_coins_id?.[index] || 'Unknown'}
              />
            ))}
            {row.top_3_coins.length > 3 && (
              <span className="text-xs text-muted-foreground">+{row.top_3_coins.length - 3}</span>
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
          if (onCategoryClick) {
            onCategoryClick(row);
          } else {
            window.location.href = `/categories/${row.id}`;
          }
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

  const handleRowClick = (row) => {
    if (onCategoryClick) {
      onCategoryClick(row);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg mb-2">
          Error loading categories
        </div>
        <div className="text-muted-foreground text-sm">
          {error.message || 'Please try again later'}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">
          No categories found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-nowrap text-muted-foreground uppercase tracking-wider"
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginationData.items.map((row, index) => (
                <tr
                  key={row.id || index}
                  onClick={() => handleRowClick(row)}
                  className="hover:bg-accent/50 cursor-pointer transition-colors"
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

      {/* Simple Pagination Component */}
      <SimplePagination
        currentPage={paginationData.currentPage}
        pageSize={ITEMS_PER_PAGE}
        totalItems={paginationData.totalItems}
        hasMoreItems={paginationData.hasNext}
        onPageChange={(page) => {
          if (page > paginationData.currentPage) {
            handlePageChange('next');
          } else if (page < paginationData.currentPage) {
            handlePageChange('prev');
          }
        }}
        className="mt-6"
      />
    </div>
  );
};

export default CategoriesTable;
