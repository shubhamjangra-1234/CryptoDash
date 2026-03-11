import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Eye, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { SimplePagination } from '../../../components/ui/Pagination';
import ExchangeDetailModal from './ExchangeDetailModal';

// Utility function for currency formatting
const formatCurrency = (value) => {
  if (!value || value === 0) return "$0";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const ExchangesTable = ({ 
  exchanges = [], 
  loading = false, 
  error = null,
  currentPage = 1,
  itemsPerPage = 50,
  totalItems = 0,
  onPageChange = null,
  onGoToPage = null,
  onRefresh = null
}) => {
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns = [
    {
      key: 'name',
      title: 'Exchange',
      sortable: false,
      render: (value, row) => {
        if (!row) return <span>-</span>;
        return (
          <div className="flex items-center gap-3">
            {row.image && (
              <img
                src={row.image}
                alt={value || 'Exchange'}
                className="w-8 h-8 rounded-full border border-border"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(value || 'Exchange')}&background=random&color=fff&size=32`;
                }}
              />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-nowrap text-foreground">{value || '-'}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{row.countryFlag}</span>
                <span>{row.country}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'trust_score',
      title: 'Trust Score',
      sortable: false,
      render: (value) => (
        <div className="text-center">
          <span className="font-medium text-foreground">
            {value ? value.toFixed(1) : 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'volume',
      title: '24h Volume',
      sortable: false,
      render: (value, row) => (
        <div className="text-right">
          <span className="font-medium text-foreground">
            {formatCurrency(row.trade_volume_24h_btc || 0)}
          </span>
        </div>
      )
    },
    {
      key: 'year_established',
      title: 'Established',
      sortable: false,
      render: (value) => (
        <div className="text-center">
          <span className="font-medium text-foreground">
            {value || 'Unknown'}
          </span>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type',
      sortable: false,
      render: (value, row) => (
        <div className="text-center">
          <span className={`px-2 py-1 text-xs rounded-full ${
            row.centralized 
              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
              : 'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
            {row.centralized ? 'Centralized' : 'Decentralized'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: false,
      render: (value, row) => (
        <div className="text-center">
          <span className={`px-2 py-1 text-xs rounded-full ${
            row.formattedStatus === 'Active' 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {row.formattedStatus}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      sortable: false,
      render: (value, row) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            {row.url && (
              <a
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md hover:bg-muted/50 transition-colors"
                title="Visit Website"
              >
                <ExternalLink className="w-4 h-4 text-cyan-500" />
              </a>
            )}
            <button
              className="p-1 rounded-md hover:bg-muted/50 transition-colors"
              title="View Details"
              onClick={() => {
                setSelectedExchange(row);
                setIsModalOpen(true);
              }}
            >
              <Eye className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded-lg mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-12 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">Error loading exchanges</div>
          <div className="text-muted-foreground text-sm mb-4">
            {error.message || 'Failed to load exchange data'}
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!exchanges.length) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
        <div className="text-center py-8">
          <div className="text-muted-foreground text-lg">No exchanges found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xl">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className="text-left py-3 px-4 text-nowrap font-semibold text-foreground text-sm"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exchanges.map((row, index) => (
              <tr
                key={row.id || index}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm">
                    {column.render ? column.render(row[column.key], row, index) : row[column.key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Pagination Component */}
      <SimplePagination
        currentPage={currentPage}
        pageSize={itemsPerPage}
        totalItems={totalItems}
        hasMoreItems={currentPage < Math.ceil(totalItems / itemsPerPage)}
        onPageChange={(page) => {
          if (page > currentPage) {
            onPageChange('next');
          } else if (page < currentPage) {
            onPageChange('prev');
          }
        }}
        className="mt-6"
      />

      {/* Exchange Detail Modal */}
      <ExchangeDetailModal
        exchange={selectedExchange}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExchange(null);
        }}
      />
    </div>
  );
};

export default ExchangesTable;
