import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * Virtualized List Component for handling large datasets efficiently
 * Renders only visible items for optimal performance
 */

const VirtualizedList = ({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5,
  renderItem,
  getItemKey = (item, index) => index,
  className = '',
  onScroll = null,
  loading = false,
  loadingComponent = null,
  emptyComponent = null,
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: containerHeight });
  const containerRef = useRef(null);
  const scrollElementRef = useRef(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const { height } = containerSize;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, containerSize, itemHeight, items.length, overscan]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);

  // Handle scroll events
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    
    if (onScroll) {
      onScroll(e);
    }
  }, [onScroll]);

  // Resize observer for container size
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Render visible items
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    const itemsToRender = [];

    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= items.length) break;
      
      const item = items[i];
      const key = getItemKey(item, i);
      
      itemsToRender.push({
        key,
        index: i,
        item,
        style: {
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight
        }
      });
    }

    return itemsToRender;
  }, [visibleRange, items, itemHeight, getItemKey]);

  // Scroll to index
  const scrollToIndex = useCallback((index) => {
    if (scrollElementRef.current) {
      const targetScrollTop = index * itemHeight;
      scrollElementRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  }, [itemHeight]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollToIndex(0);
  }, [scrollToIndex]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    scrollToIndex(items.length - 1);
  }, [scrollToIndex, items.length]);

  // Get scroll info
  const scrollInfo = useMemo(() => ({
    scrollTop,
    scrollHeight: totalHeight,
    clientHeight: containerSize.height,
    scrollPercentage: totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0,
    isAtTop: scrollTop === 0,
    isAtBottom: scrollTop + containerSize.height >= totalHeight - 1
  }), [scrollTop, totalHeight, containerSize.height]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: containerHeight }}
      {...props}
    >
      {/* Scroll container */}
      <div
        ref={scrollElementRef}
        className="h-full overflow-auto"
        onScroll={handleScroll}
      >
        {/* Spacer for total height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible items */}
          {visibleItems.map(({ key, index, item, style }) => (
            <div key={key} style={style}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          {loadingComponent || (
            <div className="text-gray-500">Loading...</div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && emptyComponent && (
        <div className="absolute inset-0 flex items-center justify-center">
          {emptyComponent}
        </div>
      )}

      {/* Scroll indicators (optional) */}
      {totalHeight > containerSize.height && (
        <>
          {/* Top shadow */}
          {scrollInfo.scrollTop > 0 && (
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none z-10" />
          )}
          
          {/* Bottom shadow */}
          {!scrollInfo.isAtBottom && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none z-10" />
          )}
        </>
      )}
    </div>
  );
};

// Market list virtualized component
export const VirtualizedMarketList = ({ 
  markets = [], 
  loading = false, 
  onMarketClick = null,
  ...props 
}) => {
  const renderMarketItem = useCallback((market, index) => {
    const isPositive = (market.priceChangePercentage24h || 0) >= 0;
    
    return (
      <div 
        className="flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
        onClick={() => onMarketClick?.(market)}
      >
        <div className="flex items-center gap-3">
          <img 
            src={market.image} 
            alt={market.name}
            className="w-8 h-8 rounded-full"
            loading="lazy"
          />
          <div>
            <div className="font-medium text-gray-900">{market.name}</div>
            <div className="text-sm text-gray-500">{market.symbol.toUpperCase()}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-medium text-gray-900">
            ${market.currentPrice?.toLocaleString() || 'N/A'}
          </div>
          <div className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{market.priceChangePercentage24h?.toFixed(2) || '0.00'}%
          </div>
        </div>
      </div>
    );
  }, [onMarketClick]);

  const emptyComponent = (
    <div className="text-center text-gray-500 py-8">
      <div className="text-lg font-medium mb-2">No markets found</div>
      <div className="text-sm">Try adjusting your search criteria</div>
    </div>
  );

  return (
    <VirtualizedList
      items={markets}
      itemHeight={80}
      containerHeight={400}
      renderItem={renderMarketItem}
      getItemKey={(market) => market.id}
      loading={loading}
      emptyComponent={emptyComponent}
      {...props}
    />
  );
};

// Table virtualized component
export const VirtualizedTable = ({
  columns = [],
  rows = [],
  loading = false,
  onRowClick = null,
  ...props
}) => {
  const renderTableRow = useCallback((row, index) => {
    return (
      <div 
        className="flex items-center border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
        onClick={() => onRowClick?.(row, index)}
      >
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="p-3 flex-1"
            style={{ minWidth: column.minWidth || '100px' }}
          >
            {column.render ? column.render(row[column.key], row) : row[column.key]}
          </div>
        ))}
      </div>
    );
  }, [columns, onRowClick]);

  const renderHeader = () => (
    <div className="flex items-center bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
      {columns.map((column, index) => (
        <div
          key={index}
          className="p-3 font-medium text-gray-700 flex-1"
          style={{ minWidth: column.minWidth || '100px' }}
        >
          {column.title}
        </div>
      ))}
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {renderHeader()}
      <VirtualizedList
        items={rows}
        itemHeight={50}
        containerHeight={400}
        renderItem={renderTableRow}
        getItemKey={(row, index) => row.id || index}
        loading={loading}
        {...props}
      />
    </div>
  );
};

// Infinite scroll virtualized list
export const InfiniteVirtualizedList = ({
  items = [],
  hasNextPage = false,
  fetchNextPage = null,
  isFetchingNextPage = false,
  itemHeight = 60,
  containerHeight = 400,
  renderItem,
  getItemKey = (item, index) => index,
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Handle scroll for infinite loading
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);

    // Check if we should load more
    if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
      const scrollElement = e.target;
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      // Load more when user is 80% from the bottom
      if (scrollPercentage > 0.8) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + 5
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, items.length]);

  // Render visible items
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    const itemsToRender = [];

    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= items.length) break;
      
      const item = items[i];
      const key = getItemKey(item, i);
      
      itemsToRender.push({
        key,
        index: i,
        item,
        style: {
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight
        }
      });
    }

    return itemsToRender;
  }, [visibleRange, items, itemHeight, getItemKey]);

  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: containerHeight }}
      {...props}
    >
      <div
        className="h-full overflow-auto"
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(({ key, index, item, style }) => (
            <div key={key} style={style}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
        
        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <div className="p-4 text-center text-gray-500">
            Loading more items...
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualizedList;
