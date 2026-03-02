import React from 'react';
import { useCryptoStats } from '../hooks/useCryptoData';
import GlobalStatsGrid from '../components/GlobalStatsGrid';
import MarketsTable from '../components/MarketsTable';
import SectionWrapper from '../../../shared/components/SectionWrapper';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorState from '../../../shared/components/ErrorState';

const DashboardPage = React.memo(() => {
  const { 
    globalData, 
    topMarkets, 
    topGainers, 
    topLosers, 
    isLoading: statsLoading, 
    error: statsError 
  } = useCryptoStats();

  const handleCoinClick = (coin) => {
    // Navigate to coin detail page
    window.location.href = `/coin/${coin.id}`;
  };

  if (statsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState 
          error={statsError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Crypto Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time cryptocurrency market data and insights
        </p>
      </div>

      {/* Global Statistics */}
      <SectionWrapper
        title="Market Overview"
        loading={statsLoading}
        error={statsError}
      >
        <GlobalStatsGrid data={globalData} loading={statsLoading} />
      </SectionWrapper>

      {/* Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Gainers */}
        <SectionWrapper
          title="🚀 Top Gainers (24h)"
          loading={statsLoading}
        >
          {statsLoading ? (
            <LoadingSkeleton type="list" />
          ) : topGainers && topGainers.length > 0 ? (
            <div className="space-y-3">
              {topGainers.map((coin, index) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleCoinClick(coin)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium">#{index + 1}</span>
                    <img 
                      src={coin.image} 
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-gray-500">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${coin.currentPrice?.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      +{coin.priceChangePercentage24h?.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No gainers data available
            </div>
          )}
        </SectionWrapper>

        {/* Top Losers */}
        <SectionWrapper
          title="📉 Top Losers (24h)"
          loading={statsLoading}
        >
          {statsLoading ? (
            <LoadingSkeleton type="list" />
          ) : topLosers && topLosers.length > 0 ? (
            <div className="space-y-3">
              {topLosers.map((coin, index) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleCoinClick(coin)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium">#{index + 1}</span>
                    <img 
                      src={coin.image} 
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-gray-500">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${coin.currentPrice?.toLocaleString()}
                    </div>
                    <div className="text-sm text-red-600 font-medium">
                      {coin.priceChangePercentage24h?.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No losers data available
            </div>
          )}
        </SectionWrapper>
      </div>

      {/* Markets Table */}
      <SectionWrapper
        title="📊 Cryptocurrency Markets"
        subtitle="Top 100 cryptocurrencies by market capitalization"
        loading={statsLoading}
      >
        <MarketsTable
          data={topMarkets}
          loading={statsLoading}
          error={statsError}
          onRowClick={handleCoinClick}
        />
      </SectionWrapper>
    </div>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
