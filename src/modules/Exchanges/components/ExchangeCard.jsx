import React from 'react';
import { ExternalLink, TrendingUp, Shield, Globe, Star } from 'lucide-react';

const ExchangeCard = ({ exchange, loading }) => {
  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-lg animate-pulse">
        <div className="h-32 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!exchange) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {exchange.image && (
            <img
              src={exchange.image}
              alt={exchange.name}
              className="w-12 h-12 rounded-xl border border-border"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(exchange.name)}&background=random&color=fff&size=48`;
              }}
            />
          )}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {exchange.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{exchange.countryFlag}</span>
              <span>{exchange.country}</span>
            </div>
          </div>
        </div>
        
        {/* Trust Score Badge */}
        <div className={`px-3 py-1 rounded-full border ${
          exchange.trust_score >= 8 
            ? 'bg-green-500/10 text-green-500 border-green-500/20'
            : exchange.trust_score >= 5
            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span className="text-xs font-medium">
              {exchange.trust_score ? exchange.trust_score.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>24h Volume</span>
          </div>
          <div className="font-semibold text-foreground text-sm">
            {exchange.formattedVolume}
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Star className="w-3 h-3" />
            <span>Rank</span>
          </div>
          <div className="font-semibold text-foreground text-sm">
            #{exchange.trust_score_rank || 'N/A'}
          </div>
        </div>
      </div>

      {/* Description */}
      {exchange.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {exchange.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            exchange.centralized 
              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
              : 'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
            {exchange.centralized ? 'Centralized' : 'Decentralized'}
          </span>
          
          <span className={`px-2 py-1 text-xs rounded-full ${
            exchange.formattedStatus === 'Active' 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {exchange.formattedStatus}
          </span>
        </div>

        {exchange.url && (
          <a
            href={exchange.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Visit Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Year Established */}
      {exchange.year_established && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            <span>Established: {exchange.year_established}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeCard;
