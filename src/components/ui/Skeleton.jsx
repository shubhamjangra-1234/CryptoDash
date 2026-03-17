import React from 'react';

// Base skeleton component
export const Skeleton = ({ 
  className = '', 
  variant = 'default',
  animation = 'pulse',
  children,
  ...props 
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : 'animate-shimmer';
  
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-20',
    card: 'h-24 w-full',
    image: 'h-48 w-full',
    circle: 'rounded-full',
    rectangle: 'rounded-md'
  };

  return (
    <div 
      className={`${baseClasses} ${animationClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card skeleton component
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Skeleton variant="avatar" className="w-8 h-8" />
              <Skeleton variant="button" className="w-16 h-6" />
            </div>
            
            {/* Title */}
            <Skeleton variant="title" />
            
            {/* Content */}
            <div className="space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-4/5" />
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center pt-3">
              <Skeleton variant="text" className="w-20" />
              <Skeleton variant="button" className="w-12 h-8" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// Table skeleton component
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`header-${index}`} variant="title" className="h-4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" className="h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Market card skeleton
export const MarketCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="avatar" className="w-10 h-10" />
              <div className="space-y-2">
                <Skeleton variant="title" className="h-4 w-20" />
                <Skeleton variant="text" className="h-3 w-16" />
              </div>
            </div>
            <Skeleton variant="button" className="w-16 h-8" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-3 w-12" />
              <Skeleton variant="title" className="h-5 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" className="h-3 w-16" />
              <Skeleton variant="title" className="h-5 w-20" />
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <Skeleton variant="text" className="h-3 w-20" />
              <Skeleton variant="button" className="w-12 h-6" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// Chart skeleton component
export const ChartSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton variant="title" className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton variant="button" className="w-12 h-8" />
            <Skeleton variant="button" className="w-12 h-8" />
            <Skeleton variant="button" className="w-12 h-8" />
          </div>
        </div>
        
        {/* Chart area */}
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full w-8 space-y-8">
            <Skeleton variant="text" className="h-3 w-6" />
            <Skeleton variant="text" className="h-3 w-6" />
            <Skeleton variant="text" className="h-3 w-6" />
            <Skeleton variant="text" className="h-3 w-6" />
          </div>
          
          {/* Chart */}
          <div className="ml-10 h-full">
            <Skeleton variant="rectangle" className="h-full w-full" />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Skeleton variant="text" className="h-3 w-24" />
          <Skeleton variant="text" className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
};

// Stats card skeleton
export const StatsCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="avatar" className="w-8 h-8" />
              <Skeleton variant="text" className="h-4 w-20" />
            </div>
            <Skeleton variant="button" className="w-16 h-6" />
          </div>
          
          <div className="space-y-2">
            <Skeleton variant="title" className="h-8 w-32" />
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" className="h-3 w-16" />
              <Skeleton variant="button" className="w-12 h-6" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// List skeleton component
export const ListSkeleton = ({ count = 5, showAvatar = true }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            {showAvatar && <Skeleton variant="avatar" className="w-8 h-8" />}
            <div className="space-y-2">
              <Skeleton variant="title" className="h-4 w-24" />
              <Skeleton variant="text" className="h-3 w-32" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton variant="title" className="h-4 w-20" />
            <Skeleton variant="button" className="w-16 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading skeleton wrapper component
export const LoadingSkeleton = ({ 
  children, 
  isLoading, 
  skeleton = <CardSkeleton count={3} />,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {skeleton}
      </div>
    );
  }
  
  return children;
};

// Add shimmer animation styles
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
`;

// Inject shimmer styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shimmerStyles;
  document.head.appendChild(styleSheet);
}

export default Skeleton;
