import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Globe, DollarSign, Activity, Clock } from 'lucide-react';
import { useCategoryDetail } from '../hooks/useCategoryDetail';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorState from '../../../shared/components/ErrorState';
import CategoryCoinsTable from '../components/CategoryCoinsTable';

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { category, isLoading, error, refetch } = useCategoryDetail(categoryId);

  const handleGoBack = () => {
    navigate('/categories');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
        </div>
        <ErrorState 
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  const isPositive = category.market_cap_change_24h >= 0;
  const changeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {category.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {category.content || 'No description available'}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              isPositive ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <changeIcon className={`w-5 h-5 ${changeColor}`} />
              <span className={`font-bold ${changeColor}`}>
                {category.formattedChange}
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-sm text-muted-foreground">Market Cap</div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {category.formattedMarketCap}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-sm text-muted-foreground">Volume (24h)</div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {category.formattedVolume}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-sm text-muted-foreground">24h Change</div>
            </div>
            <div className={`text-2xl font-bold ${changeColor}`}>
              {category.formattedChange}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {category.lastUpdated}
            </div>
          </div>
        </div>

        {/* Top Coins Section */}
        {category.top_3_coins && category.top_3_coins.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Top Coins in this Category</h2>
              <div className="text-sm text-muted-foreground">
                {category.totalCoins || category.top_3_coins.length} coins
              </div>
            </div>
            
            {/* Visual Top Coins Display */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Featured Coins</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.top_3_coins.map((coinImage, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                    <img
                      src={coinImage}
                      alt={`Top coin ${index + 1}`}
                      className="w-12 h-12 rounded-full border border-border"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${category.top_3_coins_id?.[index] || 'coin'}&background=random&color=fff&size=48`;
                      }}
                    />
                    <div>
                      <div className="font-medium text-foreground capitalize">
                        {category.top_3_coins_id?.[index]?.replace('-', ' ') || 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Top #{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coins Table */}
            {category.coins && category.coins.length > 0 && (
              <CategoryCoinsTable coins={category.coins} />
            )}
          </div>
        )}

        {/* Category Description */}
        {category.content && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">About this Category</h2>
            <div className="text-muted-foreground leading-relaxed">
              {category.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
