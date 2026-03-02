import React from 'react';
import { Button } from '../../../components/ui/button';
import { Activity, BarChart3, RotateCcw } from 'lucide-react';

const DashboardHeader = ({ 
  title = "Dashboard",
  subtitle = "Real-time cryptocurrency market overview",
  onRefresh,
  onExport,
  isRefreshing = false,
  lastRefreshTime,
  actions = null
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
        {lastRefreshTime && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(lastRefreshTime).toLocaleTimeString()}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-3">
        {actions}
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RotateCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
