import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  hasPrev, 
  hasNext, 
  onPageChange, 
  onGoToPage,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className = "",
  size = "md" // sm, md, lg
}) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm", 
    lg: "px-4 py-3 text-base"
  };

  const buttonSizeClasses = {
    sm: "w-6 h-6",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const baseButtonClass = `${sizeClasses[size]} border border-border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors`;

  const renderPageNumbers = () => {
    if (!showPageNumbers || totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Show first page if not in range
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onGoToPage(1)}
          className={`${baseButtonClass} ${currentPage === 1 ? 'bg-primary text-primary-foreground border-primary' : ''}`}
        >
          1
        </button>
      );

      // Show ellipsis if gap
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-muted-foreground">
            ...
          </span>
        );
      }
    }

    // Show pages around current
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onGoToPage(i)}
          className={`${baseButtonClass} ${currentPage === i ? 'bg-primary text-primary-foreground border-primary' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Show last page if not in range
    if (endPage < totalPages) {
      // Show ellipsis if gap
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-muted-foreground">
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => onGoToPage(totalPages)}
          className={`${baseButtonClass} ${currentPage === totalPages ? 'bg-primary text-primary-foreground border-primary' : ''}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
        {totalPages > 0 && ` (${totalPages} pages)`}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange('prev')}
          disabled={!hasPrev}
          className={`flex items-center gap-2 ${baseButtonClass}`}
        >
          <ChevronLeft className={buttonSizeClasses[size]} />
          Previous
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center space-x-1">
            {renderPageNumbers()}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange('next')}
          disabled={!hasNext}
          className={`flex items-center gap-2 ${baseButtonClass}`}
        >
          Next
          <ChevronRight className={buttonSizeClasses[size]} />
        </button>
      </div>
    </div>
  );
};

// Simple pagination for basic use cases
export const SimplePagination = ({ 
  currentPage, 
  pageSize, 
  totalItems, 
  hasMoreItems,
  onPageChange,
  className = ""
}) => {
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className= "text-[12px] md:text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} results  {hasMoreItems && '+'}
       
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-xs border border-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMoreItems}
          className="px-4 py-2 text-xs border border-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
