import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ExternalLink, Globe, MessageCircle, Users } from 'lucide-react';

const CoinDetailDescription = ({ coin, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading description</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load coin description'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coin?.description) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">No description available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-muted-foreground" />
          About {coin.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: coin.description 
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CoinDetailDescription;
