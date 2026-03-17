import { useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useCoinCalculations } from '../hooks/useCoinCalculations';
import { useCoinFormatters } from '../hooks/useCoinFormatters';

const CoinImageGallery = ({ coin }) => {
  const [selectedImageSize, setSelectedImageSize] = useState('large');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const { isPositive, getImageUrl } = useCoinCalculations(coin);
  const { formatPercentage } = useCoinFormatters();

  const handleImageError = (e) => {
    e.target.src = '/placeholder-coin.png';
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative group">
          <img 
            src={getImageUrl(selectedImageSize)}
            alt={coin.name}
            className="w-12 h-12 rounded-full object-cover border border-border cursor-pointer transition-transform group-hover:scale-105"
            onError={handleImageError}
            onClick={() => setShowImageGallery(!showImageGallery)}
          />
          <div className="absolute -bottom-1 -right-1">
            <Badge 
              variant={isPositive ? "default" : "destructive"}
              className="text-xs font-bold text-[10px]"
            >
              #{coin.rank || 'N/A'}
            </Badge>
          </div>
          {/* Hover indicator */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none" />
        </div>
        
        <div>
          <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            {coin.name}
          </h1>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="font-medium">
                {isPositive ? '+' : ''}{formatPercentage(coin.priceChange24h)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">
              {coin.symbol}
            </span>
            <Badge variant="outline" className="text-xs">
              {coin.symbol}
            </Badge>
          </div>

        </div>
      </div>
    </>
  );
};

export default CoinImageGallery;
