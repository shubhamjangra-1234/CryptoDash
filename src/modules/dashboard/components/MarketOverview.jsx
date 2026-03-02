import React, { useState, useMemo } from 'react';
import ChartContainer from '../../../shared/components/ChartContainer';
import { BarChart3, MoreHorizontal, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters';

const MarketOverview = ({ 
  data = null, 
  loading = false, 
  error = null,
  timeRange = '24h',
  onTimeRangeChange = null,
  actions = null
}) => {
  const timeRanges = [
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '1Y', value: '1y' }
  ];

  const defaultActions = (
    <Button variant="outline" size="sm">
      <BarChart3 className="h-4 w-4" />
    </Button>
  );

  // Prepare market cap chart data from API
  const marketCapData = useMemo(() => {
    console.log("MarketOverview data:", data);
    
    if (!data) {
      console.log("No chart data available");
      return [];
    }
    
    // Check for historical data in API response
    if (data.historical_data && Array.isArray(data.historical_data)) {
      console.log("Using historical data from API");
      return data.historical_data.map(item => ({
        time: item.time || item.timestamp,
        marketCap: parseFloat(item.market_cap || item.value || 0)
      }));
    }
    
    console.log("No historical data available");
    return [];
  }, [data]);
  // Prepare market dominance data from API
  const dominanceData = useMemo(() => {
    console.log("Dominance data structure:", data);
    
    if (!data?.data?.market_cap_percentage) {
      console.log("No market cap percentage data available");
      return [];
    }
    
    // Directly map API data to chart format
    const dominance = Object.entries(data.data.market_cap_percentage)
      .filter(([name, value]) => value && value > 0)
      .map(([name, value]) => ({
        name: name.toUpperCase(),
        value: parseFloat(value),
        color: `hsl(${Math.random() * 360}, 70%, 50%)` // Dynamic HSL color
      }))
      .sort((a, b) => b.value - a.value); // Sort by dominance descending
    
    console.log("Final dominance data:", dominance);
    return dominance;
  }, [data]);

  return (
    <ChartContainer
      title="Market Overview"
      subtitle="Market capitalization over time"
      actions={actions || defaultActions}
      loading={loading}
      error={error}
      className="h-full"
    >
      <div className="space-y-4">
        {/* Time Range Selector */}
        {onTimeRangeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Time Range:</span>
            <div className="flex space-x-1">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTimeRangeChange(range.value)}
                  className="text-xs"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chart Area */}
        <div className="h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mr-3" />
              Loading chart data...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              <p>Failed to load chart data</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Cap Area Chart */}
              <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Market Cap Trend</h3>
                  <div className="flex items-center space-x-2">
                    {timeRanges.map((range) => (
                      <Button
                        key={range.value}
                        variant={timeRange === range.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => onTimeRangeChange?.(range.value)}
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {marketCapData.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white">
                        ${marketCapData[marketCapData.length - 1]?.marketCap ? 
                          (marketCapData[marketCapData.length - 1].marketCap / 1000).toFixed(2) + 'T' : 
                          'Loading...'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Market Cap
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={marketCapData}>
                        <defs>
                          <linearGradient id="marketCapGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#9ca3af" 
                          tick={{ fill: '#9ca3af' }}
                        />
                        <YAxis 
                          stroke="#9ca3af" 
                          tick={{ fill: '#9ca3af' }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(1)}T`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`$${(value / 1000).toFixed(2)}T`, 'Market Cap']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="marketCap" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          fill="url(#marketCapGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <p className="text-lg">No historical data available</p>
                      <p className="text-sm mt-2">Market cap trend will appear when historical data is available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Market Dominance Donut Chart */}
              <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h3 className="text-lg font-semibold text-white mb-4">Market Dominance</h3>
                
                {dominanceData.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white">
                        {dominanceData[0]?.value ? parseFloat(dominanceData[0].value).toFixed(1) : '0'}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {dominanceData[0]?.name || 'Unknown'} Dominance
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={dominanceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {dominanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`${parseFloat(value).toFixed(1)}%`, 'Market Share']}
                        />
                        <Legend 
                          verticalAlign="middle" 
                          align="right"
                          wrapperStyle={{ color: '#9ca3af' }}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>
                              {entry.name}: {parseFloat(value).toFixed(1)}%
                            </span>
                          )}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <p className="text-lg">No dominance data available</p>
                      <p className="text-sm mt-2">Market dominance will appear when data is available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ChartContainer>
  );
};

export default MarketOverview;
