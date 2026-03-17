import React, { useState, useCallback } from 'react';
import { useCryptoStats } from '../hooks/useCryptoData';
import GlobalStatsGrid from '../components/GlobalStatsGrid';
import MarketsTable from '../components/MarketsTable';
import SectionWrapper from '../../../shared/components/SectionWrapper';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorState from '../../../shared/components/ErrorState';
import NetworkErrorUI, { EmptyStateUI, LoadingStateUI } from '../../../components/ui/NetworkErrorUI';

const DashboardPage = React.memo(() => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { 
    globalData, 
    topMarkets, 
    topGainers, 
    topLosers, 
    isLoading: statsLoading, 
    error: statsError,
    refetch
  } = useCryptoStats();

  const handleCoinClick = (coin) => {
    // Navigate to coin detail page
    window.location.href = `/coin/${coin.id}`;
  };

  const handleRetry = useCallback(async () => {
    if (retryCount >= 3) return;
    
    setIsRetrying(true);
    try {
      await refetch();
      setRetryCount(prev => prev + 1);
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  }, [refetch, retryCount]);

  // Determine error type
  const getErrorType = (error) => {
    if (!error) return null;
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'network';
    }
    if (error.status >= 500) {
      return 'server';
    }
    if (error.status >= 400) {
      return 'api';
    }
    return 'unknown';
  };

  // Check if all data is empty
  const hasNoData = !statsLoading && !statsError && 
    (!globalData || Object.keys(globalData).length === 0) &&
    (!topMarkets || topMarkets.length === 0) &&
    (!topGainers || topGainers.length === 0) &&
    (!topLosers || topLosers.length === 0);

  // Show network error UI for major errors
  if (statsError && getErrorType(statsError) !== 'api') {
    return (
      <div className="container mx-auto px-4 py-8">
        <NetworkErrorUI 
          type={getErrorType(statsError)}
          onRetry={handleRetry}
          isRetrying={isRetrying}
          retryCount={retryCount}
          maxRetries={3}
        />
      </div>
    );
  }

  // Show empty state when no data at all
  if (hasNoData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Crypto Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time cryptocurrency market data and insights
            </p>
          </div>

          <NetworkErrorUI 
            type="empty"
            onRetry={handleRetry}
            isRetrying={isRetrying}
            retryCount={retryCount}
            maxRetries={3}
          />
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState 
          error={statsError}
          onRetry={handleRetry}
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
            <EmptyStateUI 
              message="No gainers data available"
              description="There are no top gainers to display at the moment."
            />
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
            <EmptyStateUI 
              message="No losers data available"
              description="There are no top losers to display at the moment."
            />
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
