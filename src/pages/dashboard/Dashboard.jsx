import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput, DataTable, StatCard, ChartContainer } from '@/components/common/DataComponents';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';

// Sample data for demonstration
const mockStats = [
  {
    title: 'Total Market Cap',
    value: '$2.5T',
    change: '+5.2%',
    changeType: 'positive',
    icon: DollarSign,
    trend: true
  },
  {
    title: '24h Volume',
    value: '$85.2B',
    change: '+12.3%',
    changeType: 'positive',
    icon: Activity,
    trend: true
  },
  {
    title: 'BTC Dominance',
    value: '52.3%',
    change: '-1.1%',
    changeType: 'negative',
    icon: BarChart3,
    trend: true
  },
  {
    title: 'Active Cryptos',
    value: '23,456',
    change: '+156',
    changeType: 'positive',
    icon: TrendingUp,
    trend: false
  }
];

const mockCoinsData = [
  {
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$65,432',
    change: '+2.5%',
    changeType: 'positive',
    marketCap: '$1.28T',
    volume: '$28.5B',
    sparkline: 'up'
  },
  {
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,521',
    change: '-1.2%',
    changeType: 'negative',
    marketCap: '$423.1B',
    volume: '$15.2B',
    sparkline: 'down'
  },
  {
    rank: 3,
    name: 'Tether',
    symbol: 'USDT',
    price: '$1.00',
    change: '+0.1%',
    changeType: 'positive',
    marketCap: '$91.2B',
    volume: '$45.8B',
    sparkline: 'stable'
  }
];

const Dashboard = () => {
  const columns = [
    {
      key: 'rank',
      title: '#',
      render: (value) => <span className="text-muted-foreground">#{value}</span>
    },
    {
      key: 'name',
      title: 'Coin',
      render: (value, row) => {
        if (!row || !row.symbol) return <span>-</span>;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {row.symbol}
            </div>
            <div>
              <div className="font-medium">{value || '-'}</div>
              <div className="text-xs text-muted-foreground">{row.symbol}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'price',
      title: 'Price',
      render: (value) => <span className="font-medium">{value || '-'}</span>
    },
    {
      key: 'change',
      title: '24h %',
      render: (value, row) => {
        if (!row) return <span>-</span>;
        return (
          <div className="flex items-center space-x-1">
            {row.changeType === 'positive' ? (
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            )}
            <span className={row.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
              {value || '-'}
            </span>
          </div>
        );
      }
    },
    {
      key: 'marketCap',
      title: 'Market Cap',
      render: (value) => <span className="font-medium">{value || '-'}</span>
    },
    {
      key: 'volume',
      title: 'Volume',
      render: (value) => <span className="text-muted-foreground">{value || '-'}</span>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time cryptocurrency market overview
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {mockStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Top Movers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Coins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Trending Coins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCoinsData.slice(0, 3).map((coin, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {coin.symbol}
                    </div>
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs text-muted-foreground">{coin.price}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      coin.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {coin.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Overview Chart */}
        <ChartContainer 
          title="Market Overview" 
          actions={
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        >
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <BarChart3 className="h-8 w-8 mr-3" />
            Chart will be rendered here
          </div>
        </ChartContainer>
      </div>

      {/* Market Data Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Market Data</h2>
          <SearchInput 
            placeholder="Search coins..." 
            className="w-64"
          />
        </div>
        <DataTable 
          columns={columns} 
          data={mockCoinsData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
