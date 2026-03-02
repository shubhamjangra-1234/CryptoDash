import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const EmptyState = React.memo(({ 
  icon = null,
  title = "No data available",
  description = null,
  action = null,
  className = ""
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-6 text-center">
        <div className="max-w-md mx-auto">
          {icon && (
            <div className="text-6xl mb-4">
              {icon}
            </div>
          )}
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
          
          {description && (
            <p className="text-gray-600 mb-4">
              {description}
            </p>
          )}
          
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
