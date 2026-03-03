import React from 'react';
import MarketsHeader from './components/MarketsHeader';
import MarketsFilters from './components/MarketsFilters';
import MarketsTable from './components/MarketsTable';
import MarketsPagination from './components/MarketsPagination';
import SectionWrapper from '../../shared/components/SectionWrapper';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';
import ErrorState from '../../shared/components/ErrorState';

// Pure/Dumb UI Component - No business logic, only presentation
const Market = ({ 
  finalMarkets,
  isLoading,
  error,
  sortBy,
  currentPage,
  pageSize,
  sortOptions,
  hasMoreItems,
  onSortChange,
  onCoinClick,
  onPageChange,
  onRetry
}) => {
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState 
          error={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 space-y-4">
      {/* Header */}
      <MarketsHeader />

      {/* Markets Table */}
      <SectionWrapper
        title="All Cryptocurrencies"
        subtitle={`${finalMarkets?.length || 0} cryptocurrencies found`}
        loading={isLoading}
      >
        <MarketsTable
          data={finalMarkets}
          loading={isLoading}
          error={error}
          onRowClick={onCoinClick}
        />
      </SectionWrapper>

      {/* Pagination */}
      {finalMarkets && finalMarkets.length > 0 && (
        <MarketsPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={finalMarkets.length}
          hasMoreItems={hasMoreItems}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default Market;
