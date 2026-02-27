import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react';

// Reusable Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  trend 
}) => {
  const isPositive = changeType === 'positive';
  
  return (
    <Card className="hover-lift transition-subtle">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-2 text-xs">
            {trend && (
              isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )
            )}
            <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  variant = 'default' 
}) => {
  return (
    <Card className={cn(
      "transition-subtle",
      variant === 'elevated' && "shadow-xl"
    )}>
      <CardHeader className="flex items-center space-y-0">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

// Reusable Data Table Component
const DataTable = ({ 
  columns, 
  data, 
  className = "" 
}) => {
  return (
    <div className="rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className={cn("data-table", className)}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="data-table th">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-muted/50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="data-table td">
                    {column.render ? column.render(row[column.key]) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reusable Search Component
const SearchInput = ({ 
  placeholder, 
  value, 
  onChange, 
  className = "" 
}) => {
  return (
    <div className={cn("search-container", className)}>
      <div className="relative">
        <Activity className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-8"
        />
      </div>
    </div>
  );
};

// Reusable Filter Component
const FilterSection = ({ children, title }) => {
  return (
    <div className="filter-section">
      {title && (
        <>
          <h3 className="text-sm font-medium text-foreground mb-3">{title}</h3>
          <Separator className="mb-3" />
        </>
      )}
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

// Reusable Chart Container
const ChartContainer = ({ 
  title, 
  children, 
  actions,
  className = "" 
}) => {
  return (
    <Card className={cn("chart-container", className)}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        {actions && <div className="flex gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="h-52">
        {children}
      </CardContent>
    </Card>
  );
};

// Reusable Loading State
const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-primary"></div>
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
};

// Reusable Error State
const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          {message}
        </h3>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

// Reusable Empty State
const EmptyState = ({ 
  icon: Icon, 
  title, 
  description,
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
      {Icon && <Icon className="h-12 w-12 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export {
  StatCard,
  MetricCard,
  DataTable,
  SearchInput,
  FilterSection,
  ChartContainer,
  LoadingState,
  ErrorState,
  EmptyState
};
