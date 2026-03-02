import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const SectionWrapper = React.memo(({ 
  title, 
  subtitle = null,
  children, 
  loading = false, 
  error = null,
  actions = null,
  className = "",
  headerClassName = "",
  contentClassName = ""
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className={headerClassName}>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
        <CardContent className={`p-6 ${contentClassName}`}>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className={headerClassName}>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
        <CardContent className={`p-6 ${contentClassName}`}>
          <div className="text-center text-red-600">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {(title || subtitle || actions) && (
        <CardHeader className={headerClassName}>
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
});

SectionWrapper.displayName = 'SectionWrapper';

export default SectionWrapper;
