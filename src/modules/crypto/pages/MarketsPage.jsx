import React, { useState } from 'react';
import { useMarkets } from '../hooks/useCryptoData';
import MarketsTable from '../components/MarketsTable';
import SearchInput from '../../../shared/components/SearchInput';
import SectionWrapper from '../../../shared/components/SectionWrapper';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorState from '../../../shared/components/ErrorState';

const MarketsPage = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;

  const {
    data: markets,
    isLoading,
    error,
    refetch
  } = useMarkets({
    vs_currency: 'usd',
    order: sortBy,
    per_page: pageSize,
    page: currentPage,
    sparkline: false
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCoinClick = (coin) => {
    window.location.href = `/coin/${coin.id}`;
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const filteredMarkets = React.useMemo(() => {
    if (!markets || !searchQuery) return markets;
    
    return markets.filter(coin => 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [markets, searchQuery]);

  const sortOptions = [
    { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
    { value: 'market_cap_asc', label: 'Market Cap (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'volume_desc', label: 'Volume (High to Low)' },
    { value: 'volume_asc', label: 'Volume (Low to High)' },
    { value: 'change_desc', label: '24h Change (High to Low)' },
    { value: 'change_asc', label: '24h Change (Low to High)' }
  ];

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
          Cryptocurrency Markets
        </h1>
        <p className="text-gray-600">
          Live prices, market cap, and trading volume for all cryptocurrencies
        </p>
      </div>

      {/* Filters and Search */}
      <SectionWrapper title="">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="w-full lg:w-96">
            <SearchInput
              onSearch={handleSearch}
              placeholder="Search cryptocurrencies..."
              showResults={false}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SectionWrapper>

      {/* Markets Table */}
      <SectionWrapper
        title="All Cryptocurrencies"
        subtitle={`${filteredMarkets?.length || 0} cryptocurrencies found`}
        loading={isLoading}
      >
        <MarketsTable
          data={filteredMarkets}
          loading={isLoading}
          error={error}
          onRowClick={handleCoinClick}
        />
      </SectionWrapper>

      {/* Pagination */}
      {filteredMarkets && filteredMarkets.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredMarkets.length)} of{' '}
            {filteredMarkets.length} results
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
              disabled={filteredMarkets.length < pageSize}
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

MarketsPage.displayName = 'MarketsPage';

export default MarketsPage;
