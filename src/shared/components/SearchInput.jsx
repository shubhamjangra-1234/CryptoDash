import React, { useState, useCallback } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const SearchInput = React.memo(({ 
  onSearch, 
  placeholder = "Search...", 
  debounceMs = 300,
  className = "",
  showResults = false,
  results = [],
  onResultClick = null,
  loading = false
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      setDebouncedQuery(searchQuery);
      if (onSearch && searchQuery.length >= 2) {
        onSearch(searchQuery);
      }
    }, debounceMs),
    [onSearch, debounceMs]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleResultClick = (result) => {
    if (onResultClick) {
      onResultClick(result);
      setQuery('');
      setDebouncedQuery('');
    }
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClear}
          >
            ×
          </Button>
        )}
        {loading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        )}
      </div>

      {showResults && debouncedQuery.length >= 2 && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto">
          <CardContent className="p-0">
            {results.map((result, index) => (
              <div
                key={result.id || index}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center gap-3">
                  {result.thumb && (
                    <img 
                      src={result.thumb} 
                      alt={result.name} 
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-500">{result.symbol}</div>
                  </div>
                  {result.marketCapRank && (
                    <div className="ml-auto text-sm text-gray-500">
                      #{result.marketCapRank}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && debouncedQuery.length >= 2 && !loading && results.length === 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1">
          <CardContent className="p-4 text-center text-gray-500">
            No results found
          </CardContent>
        </Card>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
