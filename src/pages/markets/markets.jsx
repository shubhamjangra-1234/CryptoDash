import React from 'react';
import { Market } from '../../modules/Market';
import { useMarketData } from '../../modules/Market/hooks/useMarketData';

// Page Component - Route wrapper only, no business logic
const MarketsPage = () => {
  // Business logic hook
  const marketData = useMarketData();

  return <Market {...marketData} />;
};

export default MarketsPage;