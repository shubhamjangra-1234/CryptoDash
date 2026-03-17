import { Card, CardContent } from '../../../components/ui/card';
import {useState} from 'react';

import CoinImageGallery from './CoinImageGallery';
import PriceStatsSection from './PriceStatsSection';
import PerformanceMetricsChart from './PerformanceMetricsChart';
import SupplyMetrics from './SupplyMetrics';
import AdditionalInfoCards from './AdditionalInfoCards';

const CoinDetailHeader = ({ coin, loading, error }) => {
  const [selectedImageSize, setSelectedImageSize] = useState('large');
  const [showImageGallery, setShowImageGallery] = useState(false);

  if (loading) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-6 bg-muted rounded w-1/2 mb-2" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading coin data</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load coin details'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coin) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-muted-foreground">Coin not found</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left Section - Coin Info */}
          <CoinImageGallery coin={coin} />

          {/* Right Section - Price Stats */}
          <PriceStatsSection coin={coin} />
        </div>

        {/* Performance Metrics Graph */}
        <PerformanceMetricsChart coin={coin} />

        {/* Supply Visualization */}
        <SupplyMetrics coin={coin} />

        {/* Additional Information Section */}
        <AdditionalInfoCards coin={coin} />
      </CardContent>
    </Card>
  );
};

export default CoinDetailHeader;
