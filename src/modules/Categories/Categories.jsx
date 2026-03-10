import React from 'react';
import { useCategories } from './hooks/useCategories';
import CategoriesHeader from './components/CategoriesHeader';
import CategoryStatsBar from './components/CategoryStatsBar';
import CategoryHeroCard from './components/CategoryHeroCard';
import CategoriesTable from './components/CategoriesTable';
import CategoryDominanceChart from './components/CategoryDominanceChart';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';
import ErrorState from '../../shared/components/ErrorState';

// Pure/Dumb UI Component - No business logic, only presentation
const Categories = () => {
  // Business logic hook
  const { categories, analytics, isLoading, error, refetch } = useCategories();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded-2xl w-1/3 animate-pulse" />
          <div className="h-6 bg-muted rounded-xl w-1/2 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl border p-6 h-32 animate-pulse" />
          ))}
        </div>

        <div className="bg-card rounded-3xl border p-8 h-64 animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card rounded-2xl border p-6 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleCategoryClick = (category) => {
    // Navigate to category detail page
    window.location.href = `/categories/${category.id}`;
  };

  return (
    // <div className="bg-background min-h-screen">
      <div className="container mx-auto p-2 space-y-14">
        {/* Header */}
        <CategoriesHeader />

        {/* Stats Bar */}
        <CategoryStatsBar analytics={analytics} />

        {/* Hero Card - Top Category */}
        {analytics.topCategory && (
          <CategoryHeroCard category={analytics.topCategory} />
        )}
        {/* Dominance Chart */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Market Analytics</h2>
          <CategoryDominanceChart analytics={analytics} />
        </div>
        {/* Categories Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">All Categories</h2>
            <div className="text-sm text-muted-foreground">
              {categories.length} total categories
            </div>
          </div>
          <CategoriesTable
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />
        </div>


      </div>
    // </div>
  );
};

export default Categories;
