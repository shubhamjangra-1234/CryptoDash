import { Badge } from '../../../components/ui/badge';
import { useCoinFormatters } from '../hooks/useCoinFormatters';

const AdditionalInfoCards = ({ coin }) => {
  const { formatNumber } = useCoinFormatters();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
      {/* Market Cap Rank */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">Market Cap Rank</h4>
          <div className="text-xs text-muted-foreground">Position</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-foreground">
            #{coin.market_cap_rank || 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">
            {coin.market_cap_rank_with_rehypothecated && 
             `(#${coin.market_cap_rank_with_rehypothecated} w/ rehypothecated)`
            }
          </div>
        </div>
      </div>

      {/* Sentiment Score */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">Community Sentiment</h4>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-600"> Positive</span>
            <span className="text-sm font-bold text-green-600">{coin.sentiment_votes_up_percentage || 0}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${coin.sentiment_votes_up_percentage || 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-600"> Negative</span>
            <span className="text-sm font-bold text-red-600">{coin.sentiment_votes_down_percentage || 0}%</span>
          </div>
        </div>
      </div>

      {/* Watchlist Stats */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">Watchlist Users</h4>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(coin.watchlist_portfolio_users || 0)}
          </div>
          <div className="text-xs text-muted-foreground">
            users watching
          </div>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">Platform</h4>
          <div className="text-xs text-muted-foreground">Asset</div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Platform:</span>
            <span className="text-xs font-medium capitalize">{coin.asset_platform_id || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Web Slug:</span>
            <span className="text-xs font-medium">{coin.web_slug || 'N/A'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdditionalInfoCards;
