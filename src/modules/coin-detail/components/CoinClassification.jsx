import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Hash, Tag, Layers ,Clock,Globe,Calendar,Server } from 'lucide-react';

const CoinClassification = ({ coin, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-1/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading classification data</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load classification data'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Debug: Log the coin data to see what we're working with

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Classification & Technology
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Categories</h4>
            <span className="text-xs text-muted-foreground">
              {coin.categories ? `${coin.categories.length} tags` : '0 tags'}
            </span>
          </div>
          
          {coin.categories && Array.isArray(coin.categories) && coin.categories.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {coin.categories.map((category, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs px-2 py-1 hover:bg-muted transition-colors"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                This coin is classified in {coin.categories.length} categories
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 text-center">
              No categories available for this coin
              {coin.categories && <span className="block text-xs mt-1">Categories data: {JSON.stringify(coin.categories)}</span>}
            </div>
          )}
        </div>

        {/* Hashing Algorithm Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Hashing Algorithm</h4>
            <span className="text-xs text-muted-foreground">
              Consensus
            </span>
          </div>
          
          {coin.hashing_algorithm ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-foreground bg-muted/50 px-3 py-2 rounded-lg">
                  {coin.hashing_algorithm}
                </div>
                <div className="text-sm text-muted-foreground">
                  Consensus algorithm used for block validation and mining
                </div>
              </div>
              
              {/* Algorithm Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Algorithm Type</div>
                  <div className="text-sm font-medium text-foreground">
                    {coin.hashing_algorithm.includes('SHA') ? 'Hash Function' : 
                     coin.hashing_algorithm.includes('PoW') ? 'Proof of Work' :
                     coin.hashing_algorithm.includes('PoS') ? 'Proof of Stake' :
                     coin.hashing_algorithm.includes('Ethash') ? 'Memory-Hard' :
                     coin.hashing_algorithm.includes('Scrypt') ? 'Memory-Hard' :
                     coin.hashing_algorithm.includes('X11') ? 'Multi-Algorithm' :
                     'Cryptographic Algorithm'}
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Security Level</div>
                  <div className="text-sm font-medium text-foreground">
                    {coin.hashing_algorithm.includes('SHA-256') ? 'High (256-bit)' :
                     coin.hashing_algorithm.includes('SHA-512') ? 'Very High (512-bit)' :
                     coin.hashing_algorithm.includes('Ethash') ? 'Memory-Hard' :
                     coin.hashing_algorithm.includes('Scrypt') ? 'Memory-Hard' :
                     coin.hashing_algorithm.includes('X11') ? 'Multi-Hash' :
                     'Standard'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 text-center">
              No hashing algorithm information available
            </div>
          )}
        </div>

        {/* Additional Classification Info */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Additional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Block Time */}
            {coin.block_time_in_minutes !== null && coin.block_time_in_minutes !== undefined ? (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Block Time</div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {coin.block_time_in_minutes} minutes
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-3 opacity-50">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Block Time</div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Not available
                </div>
              </div>
            )}
            
            {/* Country Origin */}
            {coin.country_origin ? (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Country of Origin</div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {coin.country_origin}
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-3 opacity-50">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Country of Origin</div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Not available
                </div>
              </div>
            )}
            
            {/* Genesis Date */}
            {coin.genesis_date ? (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Genesis Date</div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {new Date(coin.genesis_date).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-3 opacity-50">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Genesis Date</div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Not available
                </div>
              </div>
            )}
            
            {/* Asset Platform */}
            {coin.asset_platform_id ? (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Server className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Asset Platform</div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {coin.asset_platform_id}
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-3 opacity-50">
                <div className="flex items-center gap-2 mb-1">
                  <Server className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">Asset Platform</div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Not available
                </div>
              </div>
            )}
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinClassification;
