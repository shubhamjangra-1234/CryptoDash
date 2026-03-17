import { useCoinCalculations } from '../hooks/useCoinCalculations';
import { useCoinFormatters } from '../hooks/useCoinFormatters';

const PerformanceMetricsChart = ({ coin }) => {
  const { isPositive, performanceMetrics } = useCoinCalculations(coin);
  const { formatPercentage } = useCoinFormatters();

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
      <div className="relative p-2 w-full h-32 bg-card rounded-lg border border-border overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 128"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="performanceGrid" width="80" height="32" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          
          {/* Background grid */}
          <rect width="800" height="128" fill="url(#performanceGrid)" />
          
          {/* Zero line */}
          <line
            x1="40"
            y1="64"
            x2="760"
            y2="64"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="4,4"
          />
          
          {/* Performance line */}
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={isPositive ? "text-green-500" : "text-red-500"}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={performanceMetrics.map((metric, index) => {
              const x = 40 + (index / (performanceMetrics.length - 1)) * 720;
              const value = metric.value || 0;
              // Scale: -20% to +20% mapped to chart height
              const scaledValue = Math.max(-20, Math.min(20, value));
              const y = 64 - (scaledValue / 20) * 56; // 56 = 128/2 - 8 padding
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {performanceMetrics.map((metric, index) => {
            const x = 40 + (index / (performanceMetrics.length - 1)) * 720;
            const value = metric.value || 0;
            const scaledValue = Math.max(-20, Math.min(20, value));
            const y = 64 - (scaledValue / 20) * 56;
            const isMetricPositive = value >= 0;
            
            return (
              <g key={metric.key}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="currentColor"
                  className={isMetricPositive ? "text-green-500" : "text-red-500"}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill="white"
                />
                {/* Label */}
                <text
                  x={x}
                  y="120"
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground font-medium"
                >
                  {metric.label}
                </text>
                {/* Value */}
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  className={`text-xs font-bold ${isMetricPositive ? 'fill-green-500' : 'fill-red-500'}`}
                >
                  {isMetricPositive ? '+' : ''}{formatPercentage(value)}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis labels */}
          <text x="30" y="12" textAnchor="end" className="text-xs fill-muted-foreground">+20%</text>
          <text x="30" y="68" textAnchor="end" className="text-xs fill-muted-foreground">0%</text>
          <text x="30" y="124" textAnchor="end" className="text-xs fill-muted-foreground">-20%</text>
        </svg>
      </div>
    </div>
  );
};

export default PerformanceMetricsChart;
