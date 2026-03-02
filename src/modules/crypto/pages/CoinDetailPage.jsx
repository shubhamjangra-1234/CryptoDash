import React from 'react';
import { useParams } from 'react-router-dom';
import { useCoinDetails, useMarketChart } from '../hooks/useCryptoData';
import CoinOverviewCard from '../components/CoinOverviewCard';
import MarketChartSection from '../components/MarketChartSection';
import SectionWrapper from '../../../shared/components/SectionWrapper';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorState from '../../../shared/components/ErrorState';

const CoinDetailPage = React.memo(() => {
  const { id } = useParams();
  
  const {
    data: coinDetails,
    isLoading: detailsLoading,
    error: detailsError
  } = useCoinDetails(id);

  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError
  } = useMarketChart(id, 7);

  if (detailsLoading && !coinDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState 
          error={detailsError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!coinDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          <p>Coin not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {coinDetails.name} ({coinDetails.symbol})
        </h1>
        <p className="text-gray-600">
          Detailed information and price charts for {coinDetails.name}
        </p>
      </div>

      {/* Coin Overview */}
      <SectionWrapper
        title="Overview"
        loading={detailsLoading}
        error={detailsError}
      >
        <CoinOverviewCard
          coin={coinDetails}
          loading={detailsLoading}
          error={detailsError}
        />
      </SectionWrapper>

      {/* Price Chart */}
      <SectionWrapper
        title="Price Analysis"
        loading={chartLoading}
        error={chartError}
      >
        <MarketChartSection
          data={chartData}
          loading={chartLoading}
          error={chartError}
          title={`${coinDetails.name} Price Chart`}
        />
      </SectionWrapper>

      {/* Description */}
      {coinDetails.description && (
        <SectionWrapper title="About">
          <div className="prose max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: coinDetails.description 
              }}
            />
          </div>
        </SectionWrapper>
      )}

      {/* Links */}
      {coinDetails.links && (
        <SectionWrapper title="Links">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coinDetails.links.homepage && coinDetails.links.homepage.filter(Boolean).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Official Websites</h4>
                <div className="space-y-2">
                  {coinDetails.links.homepage.filter(Boolean).map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline block"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {coinDetails.links.blockchainSite && coinDetails.links.blockchainSite.filter(Boolean).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Block Explorers</h4>
                <div className="space-y-2">
                  {coinDetails.links.blockchainSite.filter(Boolean).slice(0, 5).map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline block"
                    >
                      {url.replace(/^https?:\/\//, '').split('/')[0]}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {coinDetails.links.subredditUrl && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Community</h4>
                <div className="space-y-2">
                  <a
                    href={coinDetails.links.subredditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline block"
                  >
                    Reddit
                  </a>
                  {coinDetails.links.twitterScreenName && (
                    <a
                      href={`https://twitter.com/${coinDetails.links.twitterScreenName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline block"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      )}

      {/* Categories */}
      {coinDetails.categories && coinDetails.categories.length > 0 && (
        <SectionWrapper title="Categories">
          <div className="flex flex-wrap gap-2">
            {coinDetails.categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </SectionWrapper>
      )}
    </div>
  );
});

CoinDetailPage.displayName = 'CoinDetailPage';

export default CoinDetailPage;
