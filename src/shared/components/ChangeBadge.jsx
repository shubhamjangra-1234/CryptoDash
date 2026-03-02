import React from 'react';
import { Badge } from '../../components/ui/badge';

const ChangeBadge = React.memo(({ 
  value, 
  type = 'percentage', 
  showSign = true,
  className = "",
  positiveColor = "default",
  negativeColor = "destructive",
  neutralColor = "secondary"
}) => {
  if (value === null || value === undefined) {
    return <Badge variant={neutralColor} className={className}>-</Badge>;
  }

  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const formatValue = () => {
    const absValue = Math.abs(value);
    let formatted;
    
    if (type === 'percentage') {
      formatted = `${absValue.toFixed(2)}%`;
    } else if (type === 'currency') {
      if (absValue >= 1e9) formatted = `$${(absValue / 1e9).toFixed(2)}B`;
      else if (absValue >= 1e6) formatted = `$${(absValue / 1e6).toFixed(2)}M`;
      else if (absValue >= 1e3) formatted = `$${(absValue / 1e3).toFixed(2)}K`;
      else formatted = `$${absValue.toFixed(2)}`;
    } else {
      formatted = absValue.toLocaleString();
    }

    return showSign && !isNeutral ? (isPositive ? '+' : '-') + formatted : formatted;
  };

  const getVariant = () => {
    if (isPositive) return positiveColor;
    if (isNegative) return negativeColor;
    return neutralColor;
  };

  return (
    <Badge 
      variant={getVariant()} 
      className={`${className} ${
        isPositive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
        isNegative ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
        'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {formatValue()}
    </Badge>
  );
});

ChangeBadge.displayName = 'ChangeBadge';

export default ChangeBadge;
