import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const CategoryDominanceChart = ({ analytics }) => {
  const { categoryDominance } = analytics || {};

  if (!categoryDominance || categoryDominance.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-muted-foreground">
          No dominance data available
        </div>
      </div>
    );
  }

  // Prepare data
  const chartData = categoryDominance.slice(0, 8).map((item) => ({
    name: item?.name || 'Unknown',
    value: item?.market_cap || 0,
    percentage: item?.dominance || 0,
    formattedMarketCap: formatCurrency(item?.market_cap || 0, true),
    formattedPercentage: item?.dominance ? `${item.dominance.toFixed(2)}%` : '0.00%',
  }));

  const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    '#8b5cf6',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
  ];

  // Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-foreground font-semibold text-sm mb-1">
            {data.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Market Cap:{' '}
            <span className="text-foreground font-medium">
              {data.formattedMarketCap}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Dominance:{' '}
            <span className="text-foreground font-medium">
              {data.formattedPercentage}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
      {/* ✅ PIE CHART */}
      <div className="bg-card h-[420px] sm:h-[480px] lg:h-[500px] rounded-2xl border border-border p-4 md:p-6 shadow-xl">
        <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1">
          Market Share
        </h3>
        <p className="text-xs lg:text-sm text-muted-foreground mb-4">
          Top 8 Categories by Dominance
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              labelLine={false}
              label={({ percent }) =>
                percent > 0.08
                  ? `${(percent * 100).toFixed(0)}%`
                  : ''
              }
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            {/* ✅ FIXED LEGEND */}
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                fontSize: '12px',
                marginTop: '10px',
                maxHeight: '80px',
                overflowY: 'auto',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ BAR CHART */}
      <div className="bg-card h-[420px] sm:h-[480px] lg:h-[500px] rounded-2xl border border-border p-4 md:p-6 shadow-xl">
        <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1">
          Market Cap Comparison
        </h3>
        <p className="text-xs lg:text-sm text-muted-foreground mb-4">
          Top 8 Categories by Market Cap
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.3}
            />

            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
              angle={-30}
              textAnchor="end"
              interval={0}
              height={70}
            />

            <YAxis
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
              tickFormatter={(value) => formatCurrency(value, true)}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
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

// Utility
const formatCurrency = (value, short = false) => {
  if (!value) return "$0";
  if (short) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export default CategoryDominanceChart;