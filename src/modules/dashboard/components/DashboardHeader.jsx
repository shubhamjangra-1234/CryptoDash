import React from 'react';
import { Button } from '../../../components/ui/button';
import { Activity, BarChart3, RotateCcw, TrendingUp, Globe, Shield } from 'lucide-react';

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


      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-4xl font-bold text-foreground md:mb-2">
                {title}
              </h1>
              <p className="text-xs md:text-lg hidden md:block text-nowrap text-muted-foreground">
                {subtitle}
              </p>
              {lastRefreshTime && (
                <p className="text-xs text-muted-foreground md:mt-1">
                  Last updated: {new Date(lastRefreshTime).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-3">
              {actions}
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="bg-card/50 hover:bg-card/80"
              >
                <RotateCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </div>

  );
};

export default DashboardHeader;
