import React from 'react';
import { Crown, Star, TrendingUp, Globe, Shield, ExternalLink } from 'lucide-react';
import {formatCurrency} from "../utils/formatters";
const ExchangesHeroCard = ({ exchange, loading }) => {
  console.log("exchange",exchange);
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl mb-8 animate-pulse">
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl mb-8">
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            No exchange data available
          </div>
        </div>
      </div>
    );
  }

  const isPositive = true; // Exchanges don't typically have price changes

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card md:p-8 p-4 shadow-2xl mb-8">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24" />
      
      <div className="relative z-10">
        {/* Header with crown icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Crown className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-foreground mb-1">
                Top Exchange
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Highest trading volume by market capitalization
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Exchange info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <img src={exchange.image} alt={exchange.name} className="w-8 rounded-full h-8" />
                <h3 className="text-xl md:text-3xl font-bold text-foreground">
                  {exchange.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exchange.description ? exchange.description.substring(0, 200) + '...' : 'No description available'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 rounded-2xl p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Trust Score</div>
                <div className="text-2xl font-bold text-foreground">
                  {exchange.trust_score ? exchange.trust_score.toFixed(1) : 'N/A'}
                </div>
              </div>
              <div className="bg-card/50 rounded-2xl p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Rank</div>
                <div className="text-2xl font-bold text-foreground">
                  #{exchange.trust_score_rank || 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30`}>
                <Globe className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-blue-500">
                  {exchange.countryFlag} {exchange.country}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {exchange.year_established ? `Est. ${exchange.year_established}` : 'Year Unknown'}
              </div>
            </div>
          </div>

          {/* Right side - Exchange metrics */}
          <div className="space-y-6">
            <div className="bg-card/50 rounded-2xl p-6 border border-border">
              <h4 className="text-lg font-semibold text-foreground mb-4">Exchange Metrics</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                  </div>
                  <div className="font-semibold text-foreground">
                    {formatCurrency(exchange.trade_volume_24h_btc_normalized)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Type</span>
                  </div>
                  <div className="font-semibold text-foreground">
                    {exchange.centralized ? 'Centralized' : 'Decentralized'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Status</span>
                  </div>
                  <div className={`font-semibold ${exchange.active ? 'text-green-400' : 'text-red-400'}`}>
                    {exchange.formattedStatus}
                  </div>
                </div>

                {exchange.url && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm text-muted-foreground">Website</span>
                    </div>
                    <a 
                      href={exchange.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-cyan-500 hover:text-cyan-400 transition-colors"
                    >
                      Visit
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangesHeroCard;
