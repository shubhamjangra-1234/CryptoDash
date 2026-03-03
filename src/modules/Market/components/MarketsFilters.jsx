import React from 'react';

const MarketsFilters = ({ 
  sortBy, 
  sortOptions, 
  onSortChange 
}) => {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium">
        Sort by:
      </label>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MarketsFilters;
