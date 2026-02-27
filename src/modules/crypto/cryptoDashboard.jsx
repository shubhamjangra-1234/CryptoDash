import React, { useState } from 'react';
import { 
  useTopCryptos, 
  useCryptoStats,
  DashboardHeader,
  ViewModeToggle,
  MarketStatsGrid,
  DashboardControls,
  MainContent,
  ErrorState
} from './index';

// Main Dashboard Component - Business logic only, UI delegated to components
const CryptoDashboard = () => {
  // State management
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [currency, setCurrency] = useState('usd');
  const [limit, setLimit] = useState(50);

  // Business logic - data fetching
  const { 
    data: cryptos, 
    isLoading, 
    error, 
    refetch 
  } = useTopCryptos(limit, currency, sortBy);

  const { 
    totalMarketCap, 
    marketCapChange, 
    totalVolume, 
    btcDominance, 
    activeCryptos 
  } = useCryptoStats();

  // Event handlers - business logic
  const handleViewDetails = (cryptoId) => {
    window.location.href = `/coins/${cryptoId}`;
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  // Error handling
  if (error) {
    return (
      <ErrorState 
        message="Error loading cryptocurrency data" 
        onRetry={handleRefresh}
      />
    );
  }

  // Main layout - using dumb UI components
  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader 
        title="Cryptocurrency Market"
        description="Real-time cryptocurrency prices and market data"
      >
        <ViewModeToggle 
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </DashboardHeader>

      {/* Market Stats */}
      <MarketStatsGrid 
        totalMarketCap={totalMarketCap}
        marketCapChange={marketCapChange}
        totalVolume={totalVolume}
        btcDominance={btcDominance}
        activeCryptos={activeCryptos}
      />

      {/* Controls */}
      <DashboardControls
        viewMode={viewMode}
        sortBy={sortBy}
        currency={currency}
        limit={limit}
        isLoading={isLoading}
        onViewModeChange={handleViewModeChange}
        onSortChange={handleSortChange}
        onCurrencyChange={handleCurrencyChange}
        onLimitChange={handleLimitChange}
        onRefresh={handleRefresh}
      />

      {/* Main Content */}
      <MainContent
        viewMode={viewMode}
        data={cryptos}
        isLoading={isLoading}
        onSort={handleSortChange}
        onRefresh={handleRefresh}
        onViewDetails={handleViewDetails}
        currency={currency}
        sortBy={sortBy}
      />
    </div>
  );
};

export default CryptoDashboard;
