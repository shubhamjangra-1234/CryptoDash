import React from 'react';
import { TrendingUp, BarChart3, Globe, Shield } from 'lucide-react';

const ExchangesHeader = () => {
  return (
    <div className="">

      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-4xl font-bold text-foreground ">
                Crypto Exchanges
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Explore cryptocurrency exchanges by trading volume, trust score, and market metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangesHeader;
