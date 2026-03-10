import React from 'react';
import { Layers, TrendingUp, BarChart3 } from 'lucide-react';

const CategoriesHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 md:mb-4">
        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
          <Layers className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
            Crypto Categories
          </h1>
          <p className="md:block hidden text-sm text-muted-foreground">
            Explore cryptocurrency categories by market capitalization, trading volume, and performance metrics
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end md:flex-row md:items-center md:gap-6 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>Real-time market data</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <span>Analytics & insights</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span>{new Date().toLocaleDateString()} Updated</span>
        </div>
      </div>
    </div>
  );
};

export default CategoriesHeader;
