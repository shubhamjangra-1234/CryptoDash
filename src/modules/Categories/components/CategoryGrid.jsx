import React from 'react';
import CategoryCard from './CategoryCard';

const CategoryGrid = ({ categories, onCategoryClick }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">
          No categories available
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={onCategoryClick}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
