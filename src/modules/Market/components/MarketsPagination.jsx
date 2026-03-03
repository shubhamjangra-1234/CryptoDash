import React from 'react';

const MarketsPagination = ({ 
  currentPage, 
  pageSize, 
  totalItems, 
  hasMoreItems,
  onPageChange 
}) => {
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} results
        {hasMoreItems && '+'}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-xs border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMoreItems}
          className="px-4 py-2 text-xs border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MarketsPagination;
