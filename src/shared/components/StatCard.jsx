import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const StatCard = React.memo(({ 
  title, 
  value, 
  change = null, 
  changeType = 'percentage', 
  icon: Icon = null,  // ✅ FIXED HERE
  loading = false,
  error = null,
  className = "",
  valueClassName = "",
  titleClassName = ""
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="text-sm">Error</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const formatValue = (val) => {
    // If value is already formatted (contains $ or %), return as-is
    if (typeof val === 'string' && (val.includes('$') || val.includes('%'))) {
      return val;
    }
    
    if (typeof val === 'number') {
      if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
      if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
      if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
      return `$${val.toFixed(2)}`;
    }
    return val;
  };

  const renderChange = () => {
    if (change === null || change === undefined) return null;
    
    const isPositive = change > 0;
    const isNegative = change < 0;
    const formattedChange = changeType === 'percentage' 
      ? `${Math.abs(change).toFixed(2)}%`
      : formatValue(Math.abs(change));

    return (
      <Badge 
        variant={isPositive ? "default" : isNegative ? "destructive" : "secondary"}
        className="ml-2"
      >
        {isPositive && '+'}
        {formattedChange}
      </Badge>
    );
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium text-gray-600 ${titleClassName}`}>
              {title}
            </p>
            <div className="flex items-center mt-2">
              <p className={`text-2xl font-bold ${valueClassName}`}>
                {formatValue(value)}
              </p>
              {renderChange()}
            </div>
          </div>

          {Icon && (  // ✅ FIXED HERE
            <div className="ml-4 text-gray-400">
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;