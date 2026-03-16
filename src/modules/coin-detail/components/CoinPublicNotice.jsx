import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const CoinPublicNotice = ({ coin, loading, error }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Public Notice</CardTitle>
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
          <CardTitle>Public Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading notice</div>
            <div className="text-muted-foreground text-sm">
              {error.message || 'Failed to load public notice'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't return early - show description even if no public notice

  // Clean HTML tags from notice (only if public_notice exists)
  const cleanNotice = coin.public_notice ? coin.public_notice.replace(/<[^>]*>/g, '') : '';
  const hasLinks = coin.public_notice ? coin.public_notice.includes('<a href=') : false;

  const extractLinks = (text) => {
    const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    const links = [];
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      links.push({
        url: match[1],
        text: match[2]
      });
    }
    return links;
  };

  const links = coin.public_notice ? extractLinks(coin.public_notice) : [];

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          Public Notice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Public Notice Section - Only show if there's actual notice data */}
          {coin.public_notice && (
            <div className="flex items-start gap-3">
              <div className="mt-1">
              </div>
              <div className="flex-1">
                <div className={`text-sm text-muted-foreground leading-relaxed ${
                  !isExpanded && cleanNotice.length > 200 ? 'line-clamp-3' : ''
                }`}>
                  <span 
                    dangerouslySetInnerHTML={{ 
                      __html: coin.public_notice 
                    }}
                  />
                </div>
                
                {cleanNotice.length > 200 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Show More
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Description Section */}
          {coin.description && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">About {coin.name}</h4>
              <div className={`text-sm text-muted-foreground leading-relaxed ${
                !isExpanded && coin.description.length > 300 ? 'line-clamp-4' : ''
              }`}>
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: coin.description.replace(/\r\n\r\n/g, '<br/><br/>').replace(/\r\n/g, '<br/>')
                  }}
                />
              </div>
              
              {coin.description.length > 300 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Show More
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Extracted Links */}
          {links.length > 0 && (
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Related Links</h4>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notices - Only show if there are actual notices */}
          {coin.additional_notices && coin.additional_notices.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Additional Notices</h4>
              <div className="space-y-2">
                {coin.additional_notices.map((notice, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{notice}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {coin.additional_notices.length} Additional Notice{coin.additional_notices.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          )}

          {/* Related Topics */}
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Related Topics</h4>
            <div className="space-y-2">
              {/* Categories */}
              {coin.categories && coin.categories.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Categories</div>
                  <div className="flex flex-wrap gap-1">
                    {coin.categories.slice(0,).map((category, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="text-xs px-2 py-1"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Info */}
              {coin.asset_platform_id && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Platform</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {coin.asset_platform_id}
                  </Badge>
                </div>
              )}

              {/* Contract Info */}
              {coin.contract_address && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Contract</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded truncate max-w-[120px]">
                      {coin.contract_address.slice(0, 8)}...{coin.contract_address.slice(-6)}
                    </span>
                    <a
                      href={`https://etherscan.io/token/${coin.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Whitepaper */}
              {coin.links?.whitepaper && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Whitepaper</span>
                  <a
                    href={coin.links.whitepaper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinPublicNotice;
