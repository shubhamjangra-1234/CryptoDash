import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import DashboardStats from './components/DashboardStats';
import TopMovers from './components/TopMovers';
import MarketOverview from './components/MarketOverview';
import MarketDataTable from './components/MarketDataTable';
import { useDashboard } from './hooks/useDashboard';
import { useMarketStats, useTopMovers, useMarketDataTable, useChartData } from './hooks/useMarketData';

// Main Dashboard Component - Purely presentational (dumb UI)
const Dashboard = () => {
  // Dashboard state management
  const { config, actions } = useDashboard();
  
  // Data fetching hooks
  const { data: statsData, isLoading: statsLoading, error: statsError } = useMarketStats();
  const { data: moversData, isLoading: moversLoading, error: moversError } = useTopMovers();
  const { data: marketData, isLoading: marketLoading, error: marketError } = useMarketDataTable(config);
  const { data: chartData, isLoading: chartLoading, error: chartError } = useChartData(config.chartTimeRange);


  // Event handlers
  const handleStatClick = (statType) => {

  };

  const handleCoinClick = (coin) => {
    // Navigate to coin detail page
    if (coin.id) {
      window.location.href = `/coin/${coin.id}`;
    }
  };

  const handleSearchChange = (query) => {
    actions.setSearchQuery(query);
  };

  const handleSortChange = (sortBy) => {
    actions.setSortBy(sortBy);
  };

  const handleTimeRangeChange = (timeRange) => {
 
  };

  const handleExport = () => {
    actions.export();
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleStatAction = (action) => {
  };

  // Loading states
  const isLoading = statsLoading || moversLoading || marketLoading || chartLoading;
  const hasError = statsError || moversError || marketError || chartError;

  return (
    <div className="container mx-auto p-2 space-y-6">
      {/* Header Section */}
      <DashboardHeader
        title="CryptoDash"
        subtitle="Real-time cryptocurrency market overview"
        onRefresh={handleRefresh}
        onExport={handleExport}
        isRefreshing={config.isRefreshing}
        lastRefreshTime={config.lastRefreshTime}
        data={{ gainer: moversData?.gainer }}
      />

      {/* Stats Grid */}
      <DashboardStats
        data={statsData}
        loading={statsLoading}
        error={statsError}
        onStatClick={handleStatClick}
      />

      {/* Top Movers Section */}
      <TopMovers
        data={moversData}
        loading={moversLoading}
        error={moversError}
        onCoinClick={handleCoinClick}
      />

      {/* Market Overview Chart */}
      {/* <MarketOverview
        data={chartData}
        loading={chartLoading}
        error={chartError}
        timeRange={config.chartTimeRange}
        onTimeRangeChange={handleTimeRangeChange}
      /> */}

      {/* Market Data Table */}
      {/* <MarketDataTable
        data={marketData}
        loading={marketLoading}
        error={marketError}
        searchQuery={config.searchQuery}
        onSearchChange={handleSearchChange}
        onRowClick={handleCoinClick}
        sortBy={config.sortBy}
        onSortChange={handleSortChange}
      /> */}
    </div>
  );
};

export default Dashboard;
