import React from 'react';
import { ExternalLink, TrendingUp, Shield, Globe, Star, BarChart3, Activity, Users, Calendar } from 'lucide-react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../../../components/ui/Modal';
import Card, { CardHeader, CardBody } from '../../../components/ui/Card';
import Badge, { StatusBadge } from '../../../components/ui/Badge';
import {formatCurrency} from "../utils/formatters"
const ExchangeDetailModal = ({ exchange, isOpen, onClose }) => {
  if (!exchange) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Exchange Details"
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              {exchange.image && (
                <img
                  src={exchange.image}
                  alt={exchange.name}
                  className="w-16 h-16 rounded-2xl border border-border"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(exchange.name)}&background=random&color=fff&size=64`;
                  }}
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {exchange.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{exchange.countryFlag}</span>
                  <span>{exchange.country}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <StatusBadge status={exchange.formattedStatus === 'Active' ? 'active' : 'inactive'} />
              <StatusBadge status={exchange.centralized ? 'centralized' : 'decentralized'} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="md" shadow="md">
              <CardBody>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Trust Score</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {exchange.trust_score ? exchange.trust_score.toFixed(1) : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Rank: #{exchange.trust_score_rank || 'N/A'}
                </div>
              </CardBody>
            </Card>

            <Card padding="md" shadow="md">
              <CardBody>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>24h Volume</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(exchange.trade_volume_24h_btc_normalized)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Trading volume
                </div>
              </CardBody>
            </Card>

            <Card padding="md" shadow="md">
              <CardBody>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Rank</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  #{exchange.trust_score_rank || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Trust score rank
                </div>
              </CardBody>
            </Card>

            <Card padding="md" shadow="md">
              <CardBody>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Established</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {exchange.year_established || 'Unknown'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Year founded
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Description */}
          {exchange.description && (
            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  About
                </h4>
              </CardHeader>
              <CardBody>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {exchange.description}
                </p>
              </CardBody>
            </Card>
          )}

          {/* Links */}
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-500" />
                Links
              </h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exchange.url && (
                  <a
                    href={exchange.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-cyan-500" />
                    <span className="text-foreground font-medium">Official Website</span>
                  </a>
                )}
                
                {exchange.twitter_handle && (
                  <a
                    href={`https://twitter.com/${exchange.twitter_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-blue-500" />
                    <span className="text-foreground font-medium">Twitter</span>
                  </a>
                )}
                
                {exchange.facebook_url && (
                  <a
                    href={exchange.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                    <span className="text-foreground font-medium">Facebook</span>
                  </a>
                )}
                
                {exchange.telegram_url && (
                  <a
                    href={exchange.telegram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-blue-400" />
                    <span className="text-foreground font-medium">Telegram</span>
                  </a>
                )}
              </div>
            </CardBody>
          </Card>

        </div>
      </ModalBody>
    </Modal>
  );
};

export default ExchangeDetailModal;
