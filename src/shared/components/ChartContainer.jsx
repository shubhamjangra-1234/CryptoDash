import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const ChartContainer = React.memo(({ 
  title, 
  subtitle = null,
  children, 
  loading = false, 
  error = null,
  actions = null,
  timeRange = null,
  onTimeRangeChange = null,
  className = ""
}) => {
  const timeRanges = [
    { label: '24H', value: 1 },
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
    { label: '1Y', value: 365 }
  ];

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
              <div className="h-32 bg-gray-200 rounded w-full max-w-md mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading chart</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {timeRange && onTimeRangeChange && (
              <div className="flex gap-1">
                {timeRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onTimeRangeChange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            )}
            {actions}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
});

ChartContainer.displayName = 'ChartContainer';

export default ChartContainer;
