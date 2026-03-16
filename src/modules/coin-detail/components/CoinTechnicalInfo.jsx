import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Hash, Clock, Globe, ExternalLink } from 'lucide-react';

const CoinTechnicalInfo = ({ coin, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading technical info</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load technical information'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">No technical information available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const technicalData = [
    {
      label: 'Web Slug',
      value: coin.web_slug || 'N/A',
      icon: <Globe className="w-4 h-4" />
    },
    {
      label: 'Asset Platform',
      value: coin.asset_platform_id || 'N/A',
      icon: <Hash className="w-4 h-4" />
    },
    {
      label: 'Block Time',
      value: coin.block_time_in_minutes ? `${coin.block_time_in_minutes} min` : 'N/A',
      icon: <Clock className="w-4 h-4" />
    },
    {
      label: 'Hashing Algorithm',
      value: coin.hashing_algorithm || 'N/A',
      icon: <Hash className="w-4 h-4" />
    },
    {
      label: 'Country Origin',
      value: coin.country_origin || 'N/A',
      icon: <Globe className="w-4 h-4" />
    },
    {
      label: 'Genesis Date',
      value: coin.genesis_date ? new Date(coin.genesis_date).toLocaleDateString() : 'N/A',
      icon: <Clock className="w-4 h-4" />
    },
    {
      label: 'Contract Address',
      value: coin.contract_address || 'N/A',
      icon: <ExternalLink className="w-4 h-4" />,
      isAddress: true
    },
    {
      label: 'Preview Listing',
      value: coin.preview_listing ? 'Yes' : 'No',
      icon: <Badge variant={coin.preview_listing ? 'default' : 'secondary'} />,
      isBadge: true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-muted-foreground" />
          Technical Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {technicalData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">
                  {item.icon}
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.isAddress && item.value !== 'N/A' ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                      {item.value}
                    </span>
                    <a
                      href={`https://etherscan.io/token/${item.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : item.isBadge ? (
                  item.icon
                ) : (
                  <span className="text-sm text-muted-foreground font-mono">
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinTechnicalInfo;
