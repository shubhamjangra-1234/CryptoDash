import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ExternalLink, Globe, MessageCircle, Users, Github } from 'lucide-react';

const CoinDetailLinks = ({ coin, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-3/4" />
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
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading links</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load coin links'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coin?.links) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">No links available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { homepage = [], blockchainSite = [], twitterScreenName, redditUrl } = coin.links || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-muted-foreground" />
          Official Links
        </CardTitle>
      </CardHeader>
      <CardContent>


        {/* Categories */}
        {coin.categories && coin.categories.length > 0 && (
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Ecosystem Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {coin.categories.slice(0, 8).map((category, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="px-3 py-1 text-sm"
                >
                  {category}
                </Badge>
              ))}
              {coin.categories.length > 8 && (
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  +{coin.categories.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Official Websites */}
          {homepage && homepage.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Official Websites
              </h4>
              <div className="space-y-2">
                {homepage.filter(Boolean).slice(0, 3).map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {url.replace(/^https?:\/\//, '').split('/')[0]}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Blockchain Explorers */}
          {blockchainSite && blockchainSite.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Blockchain Explorers
              </h4>
              <div className="space-y-2">
                {blockchainSite.filter(Boolean).slice(0, 3).map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {url.replace(/^https?:\/\//, '').split('/')[0]}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Community */}
          {(twitterScreenName || redditUrl) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Community
              </h4>
              <div className="space-y-2">
                {redditUrl && (
                  <a
                    href={redditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Reddit
                  </a>
                )}
                {twitterScreenName && (
                  <a
                    href={`https://twitter.com/${twitterScreenName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Twitter
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Source Code */}
          {coin.links?.repos_url && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Github className="w-4 h-4" />
                Source Code
              </h4>
              <div className="space-y-2">
                {coin.links.repos_url.github?.map((repo, index) => (
                  <a
                    key={index}
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <Github className="w-3 h-3" />
                    {repo.replace(/^https?:\/\//, '').split('/')[0]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinDetailLinks;
