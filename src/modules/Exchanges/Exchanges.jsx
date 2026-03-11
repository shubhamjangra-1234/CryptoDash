import React, { useState } from 'react';
import  ExchangesHeader  from './components/ExchangesHeader';
import  ExchangesStatsBar  from './components/ExchangesStatsBar';
import  ExchangesHeroCard  from './components/ExchangesHeroCard';
import  ExchangesTable  from './components/ExchangesTable';
import ExchangesDominanceChart from './components/ExchangesDominanceChart';
import  {useExchanges}  from './hooks/useExchanges';

const Exchanges = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const { exchanges, analytics, isLoading, error, refetch } = useExchanges();

  // Handle pagination
  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(exchanges.length / ITEMS_PER_PAGE)) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleGoToPage = (page) => {
    if (page >= 1 && page <= Math.ceil(exchanges.length / ITEMS_PER_PAGE)) {
      setCurrentPage(page);
    }
  };

  // Get paginated exchanges
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedExchanges = exchanges.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-2 space-y-6">
      {/* Header */}
      <ExchangesHeader />

      {/* Stats Bar */}
      <ExchangesStatsBar analytics={analytics} loading={isLoading} />

      {/* Hero Card */}
      <ExchangesHeroCard exchange={analytics.topExchange} loading={isLoading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1  gap-6">
        {/* Charts */}
        <div className="space-y-6">
          <ExchangesDominanceChart analytics={analytics} loading={isLoading} />
        </div>


      </div>
        {/* Exchanges Table */}
        <div className="lg:col-span-2">
          <ExchangesTable
            exchanges={paginatedExchanges}
            loading={isLoading}
            error={error}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={exchanges.length}
            onPageChange={handlePageChange}
            onGoToPage={handleGoToPage}
            onRefresh={refetch}
          />
        </div>
    </div>
  );
};

export default Exchanges;
