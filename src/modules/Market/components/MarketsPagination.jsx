import React from 'react';
import { SimplePagination } from '../../../components/ui/Pagination';

// Re-export SimplePagination as MarketsPagination for backward compatibility
const MarketsPagination = ({ 
  currentPage, 
  pageSize, 
  totalItems, 
  hasMoreItems,
  onPageChange 
}) => {
  return (
    <SimplePagination
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      hasMoreItems={hasMoreItems}
      onPageChange={onPageChange}
    />
  );
};

export default MarketsPagination;
