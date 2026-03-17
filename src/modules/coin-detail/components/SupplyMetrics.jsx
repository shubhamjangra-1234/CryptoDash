import { useCoinCalculations } from '../hooks/useCoinCalculations';
import { useCoinFormatters } from '../hooks/useCoinFormatters';

const SupplyMetrics = ({ coin }) => {
  const { supplyPercentage } = useCoinCalculations(coin);
  const { formatNumber, formatPercentage } = useCoinFormatters();

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-foreground">Supply Metrics</h3>
        <div className="text-sm text-muted-foreground">
          {formatNumber(coin.circulatingSupply)} / {formatNumber(coin.maxSupply)}
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-3">
        <div 
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(supplyPercentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Circulating Supply</span>
        <span>{formatPercentage(supplyPercentage)}</span>
        <span>Max Supply</span>
      </div>
    </div>
  );
};

export default SupplyMetrics;
