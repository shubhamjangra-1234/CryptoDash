import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const CategoryDominanceChart = ({ analytics }) => {
  const { categoryDominance } = analytics;

  if (!categoryDominance || categoryDominance.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-muted-foreground text-lg mb-4">
            No dominance data available
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for charts with proper formatting
  const chartData = categoryDominance.slice(0, 8).map(item => ({
    name: item.name,
    value: item.market_cap,
    percentage: item.dominance,
    formattedMarketCap: formatCurrency(item.market_cap, true),
    formattedPercentage: `${item.dominance.toFixed(2)}%`
  }));

  // Use theme colors with fallbacks
  const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)', 
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    '#8b5cf6', // fallback purple
    '#3b82f6', // fallback cyan
    '#10b981', // fallback green
    '#f59e0b'  // fallback orange
  ];

  // Custom tooltip with enhanced styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-foreground font-semibold text-sm mb-1">{data.name}</p>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs text-left">
              Market Cap: <span className="text-foreground font-medium">{data.formattedMarketCap}</span>
            </p>
            <p className="text-muted-foreground text-xs text-left">
              Dominance: <span className="text-foreground font-medium">{data.formattedPercentage}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Enhanced custom label for pie chart with better alignment
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 3) return null; // Don't show label for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-xs font-bold drop-shadow-md"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          {percent >= 5 ? `${percent.toFixed(0)}%` : ''}
        </text>
      </g>
    );
  };

  // Enhanced legend formatter
  const renderLegendText = (value) => (
    <span className="text-foreground text-sm font-medium">{value}</span>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
      {/* Pie Chart */}
      <div className="bg-card h-[500px] rounded-2xl border border-border p-2 md:p-6 shadow-xl w-full">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1">Market Share</h3>
            <div className="text-xs lg:text-sm text-muted-foreground">
              Top 8 Categories by Dominance
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="var(--muted)"
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={80}
              formatter={renderLegendText}
              iconType="circle"
              wrapperStyle={{ 
                paddingTop: '10px',
                textAlign: 'left'
              }}
              align="left"
              layout="horizontal"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Market Cap Comparison</h3>
            <div className="text-sm text-muted-foreground">
              Top 8 Categories by Market Cap
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border)" 
              strokeOpacity={0.3}
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11, textAnchor: 'end' }}
              angle={-45}
              height={80}
              interval={0}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11, textAnchor: 'end' }}
              tickFormatter={(value) => formatCurrency(value, true)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'var(--primary)', fillOpacity: 0.1 }}
            />
            <Bar 
              dataKey="value" 
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              animationBegin={400}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`bar-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Utility function
const formatCurrency = (value, short = false) => {
  if (!value) return "$0";
  if (short) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  }
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export default CategoryDominanceChart;
