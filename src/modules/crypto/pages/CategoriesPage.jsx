import React from 'react';
import { useCategories } from '../hooks/useCryptoData';
import CategoriesList from '../components/CategoriesList';
import SectionWrapper from '../../../shared/components/SectionWrapper';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorState from '../../../shared/components/ErrorState';

const CategoriesPage = React.memo(() => {
  const {
    data: categories,
    isLoading,
    error,
    refetch
  } = useCategories();

  const handleCategoryClick = (category) => {
    // Navigate to category detail or filter markets by category
    console.log('Category clicked:', category);
  };

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cryptocurrency Categories
        </h1>
        <p className="text-gray-600">
          Explore different cryptocurrency categories and their market performance
        </p>
      </div>

      {/* Categories List */}
      <SectionWrapper
        title="All Categories"
        subtitle={`${categories?.length || 0} categories found`}
        loading={isLoading}
      >
        <CategoriesList
          data={categories}
          loading={isLoading}
          error={error}
          onCategoryClick={handleCategoryClick}
        />
      </SectionWrapper>
    </div>
  );
});

CategoriesPage.displayName = 'CategoriesPage';

export default CategoriesPage;
