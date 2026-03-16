import React from 'react';
import { useParams } from 'react-router-dom';
import { useCoinDetails, useCoinMarketChart } from '../hooks/useCoinDetail';
import CoinDetailHeader from '../components/CoinDetailHeader';
import CoinDetailDescription from '../components/CoinDetailDescription';
import CoinDetailLinks from '../components/CoinDetailLinks';
import GlobalPriceComparison from '../components/GlobalPriceComparison';
import MarketPairPerformance from '../components/MarketPairPerformance';
import MarketChartSection from '../components/MarketChartSection';
import CoinTechnicalInfo from '../components/CoinTechnicalInfo';
import CoinMarketStats from '../components/CoinMarketStats';
import CoinPublicNotice from '../components/CoinPublicNotice';
import CoinClassification from '../components/CoinClassification';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorState from '../../../shared/components/ErrorState';

const CoinDetailPage = React.memo(() => {
  const { id } = useParams();
  
  // Data fetching hooks
  const {
    data: coinDetails,
    isLoading: detailsLoading,
    error: detailsError
  } = useCoinDetails(id);

  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError
  } = useCoinMarketChart(id, 7);

  // Loading state
  if (detailsLoading && !coinDetails) {
    return (
      <div className="container mx-auto p-2 space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  // Error state
  if (detailsError) {
    return (
      <div className="container mx-auto p-2">
        <ErrorState 
          error={detailsError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Not found state
  if (!coinDetails) {
    return (
      <div className="container mx-auto p-2">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-xl text-center">
          <div className="text-muted-foreground">
            Coin not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      {/* Header Section */}
      <CoinDetailHeader
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      />

      {/* Public Notice */}
      <CoinPublicNotice
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      />

      {/* Price Chart */}
      <MarketChartSection
        chartData={chartData}
        loading={chartLoading}
        error={chartError}
        title={`${coinDetails.name} Price Chart`}
      />

      {/* Market Statistics */}
      <CoinMarketStats
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      />

      {/* Classification & Technology */}
      <CoinClassification
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      />

      {/* Global Price Comparison */}
      <GlobalPriceComparison
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      />

      {/* Market Pair Performance */}
      <MarketPairPerformance
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      />

      {/* Technical Information
      <CoinTechnicalInfo
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      /> */}

      {/* Description */}
      <CoinDetailDescription
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      />

      {/* Links */}
      <CoinDetailLinks
        coin={coinDetails}
        loading={detailsLoading}
        error={detailsError}
      />
    </div>
  );
});

CoinDetailPage.displayName = 'CoinDetailPage';

export default CoinDetailPage;
