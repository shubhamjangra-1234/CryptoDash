import React, { useState } from 'react';
import ChartContainer from '../../../shared/components/ChartContainer';
import { formatCurrency } from '../utils/formatters';

const MarketChartSection = React.memo(({ 
  chartData, 
  loading = false, 
  error = null,
  title = "Price Chart",
  currency = 'usd'
}) => {
  const [timeRange, setTimeRange] = useState(7);
  const [chartType, setChartType] = useState('prices');
  
  
  // Handle undefined data gracefully
  if (!chartData || Object.keys(chartData).length === 0) {
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

  // Handle CoinGecko API data structure
  const getChartData = () => {
    switch (chartType) {
      case 'prices':
        return chartData.prices || [];
      case 'marketCaps':
        return chartData.market_caps || [];
      case 'totalVolumes':
        return chartData.total_volumes || [];
      default:
        return chartData.prices || [];
    }
  };

  const chartDataArray = getChartData();
  
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
    if (!Array.isArray(chartDataArray) || chartDataArray.length === 0) return 0;
    return Math.min(...chartDataArray.map(item => item[1]));
  };

  const getMaxValue = () => {
    if (!Array.isArray(chartDataArray) || chartDataArray.length === 0) return 0;
    return Math.max(...chartDataArray.map(item => item[1]));
  };

  const getLatestValue = () => {
    if (!Array.isArray(chartDataArray) || chartDataArray.length === 0) return 0;
    return chartDataArray[chartDataArray.length - 1][1];
  };

  const renderSimpleChart = () => {
    if (!Array.isArray(chartDataArray) || chartDataArray.length === 0) {
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
        <div className="flex flex-col gap-6 md:flex-row justify-between items-center mb-4">
          <div className="flex gap-2">
            {['prices', 'marketCaps', 'totalVolumes'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded text-nowrap text-sm font-medium transition-colors ${
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
          <div className="text-sm text-nowrap text-gray-600">
            {getChartTypeLabel()}: {formatValue(chartDataArray[chartDataArray.length - 1]?.[1] || 0)}
          </div>
        </div>

        {/* Simple SVG Chart */}
        <svg className="w-full h-[220px]" viewBox="0 0 500 220">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = i * 40 + 20;
            const value = minValue + (range / 4) * (4 - i);
            return (
              <g key={i}>
                <line
                  x1="80"
                  y1={y}
                  x2="500"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x="75"
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {formatValue(value)}
                </text>
              </g>
            );
          })}

          {/* Chart line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={chartDataArray.map((point, index) => {
              if (!Array.isArray(point) || point.length < 2) return '';
              const x = 80 + (index / (chartDataArray.length - 1)) * 420;
              const y = 200 - (((point[1] || 0) - minValue) / range) * 180;
              return `${x},${y}`;
            }).filter(Boolean).join(' ')}
          />

          {/* Area under line */}
          <polygon
            fill="url(#gradient)"
            opacity="0.3"
            points={`80,200 ${chartDataArray.map((point, index) => {
              if (!Array.isArray(point) || point.length < 2) return '';
              const x = 80 + (index / (chartDataArray.length - 1)) * 420;
              const y = 200 - ((point[1] || 0 - minValue) / range) * 180;
              return `${x},${y}`;
            }).filter(Boolean).join(' ')} 500,200`}
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
          <span>{chartDataArray[0] && Array.isArray(chartDataArray[0]) ? new Date(chartDataArray[0][0]).toLocaleDateString() : 'N/A'}</span>
          <span>{chartDataArray[chartDataArray.length - 1] && Array.isArray(chartDataArray[chartDataArray.length - 1]) ? new Date(chartDataArray[chartDataArray.length - 1][0]).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer
      title={title}
      subtitle={null}
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
