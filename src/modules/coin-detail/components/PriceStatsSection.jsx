import { useCoinFormatters } from '../hooks/useCoinFormatters';

const PriceStatsSection = ({ coin }) => {
  const { formatPrice, formatMarketCap } = useCoinFormatters();

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="text-right">
        <div className="text-sm text-muted-foreground mb-1">Current Price</div>
        <div className="text-3xl font-bold text-foreground">
          {formatPrice(coin.currentPrice)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-right">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
          <div className="text-lg font-semibold text-foreground">
            {formatMarketCap(coin.marketCap)}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
          <div className="text-lg font-semibold text-foreground">
            {formatMarketCap(coin.totalVolume)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceStatsSection;
