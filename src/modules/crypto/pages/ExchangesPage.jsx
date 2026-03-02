import React, { useState } from 'react';
import { useExchanges } from '../hooks/useCryptoData';
import ExchangeTable from '../components/ExchangeTable';
import SearchInput from '../../../shared/components/SearchInput';
import SectionWrapper from '../../../shared/components/SectionWrapper';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorState from '../../../shared/components/ErrorState';

const ExchangesPage = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;

  const {
    data: exchanges,
    isLoading,
    error,
    refetch
  } = useExchanges({
    per_page: pageSize,
    page: currentPage
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleExchangeClick = (exchange) => {
    // Navigate to exchange detail page
    console.log('Exchange clicked:', exchange);
  };

  const filteredExchanges = React.useMemo(() => {
    if (!exchanges || !searchQuery) return exchanges;
    
    return exchanges.filter(exchange => 
      exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchange.country?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exchanges, searchQuery]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState 
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cryptocurrency Exchanges
        </h1>
        <p className="text-gray-600">
          Compare and explore different cryptocurrency exchanges
        </p>
      </div>

      {/* Search */}
      <SectionWrapper title="">
        <div className="w-full lg:w-96">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search exchanges..."
            showResults={false}
          />
        </div>
      </SectionWrapper>

      {/* Exchanges Table */}
      <SectionWrapper
        title="All Exchanges"
        subtitle={`${filteredExchanges?.length || 0} exchanges found`}
        loading={isLoading}
      >
        <ExchangeTable
          data={filteredExchanges}
          loading={isLoading}
          error={error}
          onExchangeClick={handleExchangeClick}
        />
      </SectionWrapper>

      {/* Pagination */}
      {filteredExchanges && filteredExchanges.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredExchanges.length)} of{' '}
            {filteredExchanges.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={filteredExchanges.length < pageSize}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

ExchangesPage.displayName = 'ExchangesPage';

export default ExchangesPage;
