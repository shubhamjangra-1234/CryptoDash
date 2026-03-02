import React, { useState } from 'react';
import ChartContainer from '../../../shared/components/ChartContainer';
import { formatCurrency } from '../utils/formatters';

const MarketChartSection = React.memo(({ 
  data, 
  loading = false, 
  error = null,
  title = "Price Chart",
  currency = 'usd'
}) => {
  const [timeRange, setTimeRange] = useState(7);
  const [chartType, setChartType] = useState('prices');

  if (!data) {
    return (
      <ChartContainer
        title={title}
        loading={loading}
        error={error}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      >
        <div className="h-full flex items-center justify-center text-gray-500">
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  const chartData = data[chartType] || [];
  
  const getChartTypeLabel = () => {
    switch (chartType) {
      case 'prices': return 'Price';
      case 'marketCaps': return 'Market Cap';
      case 'totalVolumes': return 'Volume';
      default: return 'Price';
    }
  };

  const formatValue = (value) => {
    if (chartType === 'prices' || chartType === 'marketCaps') {
      return formatCurrency(value);
    }
    return formatCurrency(value);
  };

  const getMinValue = () => {
    if (chartData.length === 0) return 0;
    return Math.min(...chartData.map(point => point[1]));
  };

  const getMaxValue = () => {
    if (chartData.length === 0) return 100;
    return Math.max(...chartData.map(point => point[1]));
  };

  const renderSimpleChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          No {getChartTypeLabel().toLowerCase()} data available
        </div>
      );
    }

    const minValue = getMinValue();
    const maxValue = getMaxValue();
    const range = maxValue - minValue || 1;

    return (
      <div className="h-full relative">
        {/* Chart Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {['prices', 'marketCaps', 'totalVolumes'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  chartType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'prices' ? 'Price' : 
                 type === 'marketCaps' ? 'Market Cap' : 'Volume'}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {getChartTypeLabel()}: {formatValue(chartData[chartData.length - 1]?.[1] || 0)}
          </div>
        </div>

        {/* Simple SVG Chart */}
        <svg className="w-full h-48" viewBox="0 0 400 200">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * 40}
              x2="400"
              y2={i * 40}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Chart line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={chartData.map((point, index) => {
              const x = (index / (chartData.length - 1)) * 400;
              const y = 200 - ((point[1] - minValue) / range) * 200;
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Area under the line */}
          <polygon
            fill="url(#gradient)"
            opacity="0.3"
            points={`0,200 ${chartData.map((point, index) => {
              const x = (index / (chartData.length - 1)) * 400;
              const y = 200 - ((point[1] - minValue) / range) * 200;
              return `${x},${y}`;
            }).join(' ')} 400,200`}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Chart Footer */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{chartData[0]?.date.toLocaleDateString()}</span>
          <span>{chartData[chartData.length - 1]?.date.toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer
      title={title}
      subtitle={`${getChartTypeLabel()} Chart - ${timeRange} days`}
      loading={loading}
      error={error}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
    >
      {renderSimpleChart()}
    </ChartContainer>
  );
});

MarketChartSection.displayName = 'MarketChartSection';

export default MarketChartSection;
