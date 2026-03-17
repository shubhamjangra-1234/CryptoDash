import React from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';

const LoadingSkeleton = React.memo(({ 
  type = 'default', 
  lines = 3, 
  className = "",
  height = null 
}) => {
  // Centered dashboard loading with spinner
  if (type === 'dashboard') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated Spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            
            {/* Loading Text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Dashboard Loading
              </h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we prepare your data...
              </p>
            </div>
            
            {/* Animated Dots */}
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTableSkeleton = () => (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="text-left p-4 font-medium text-gray-700">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {[...Array(5)].map((_, colIndex) => (
                    <td key={colIndex} className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderCardSkeleton = () => (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatsSkeleton = () => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderChartSkeleton = () => (
    <Card className={className}>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  );

  const renderDefaultSkeleton = () => (
    <div className={`space-y-3 ${className}`} style={height ? { height } : {}}>
      {[...Array(lines)].map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ 
            width: `${Math.random() * 40 + 60}%` 
          }}
        ></div>
      ))}
    </div>
  );

  const renderListSkeleton = () => (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  switch (type) {
    case 'table':
      return renderTableSkeleton();
    case 'card':
      return renderCardSkeleton();
    case 'stats':
      return renderStatsSkeleton();
    case 'chart':
      return renderChartSkeleton();
    case 'list':
      return renderListSkeleton();
    default:
      return renderDefaultSkeleton();
  }
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;
