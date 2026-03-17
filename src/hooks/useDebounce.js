import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing values with advanced features
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} options - Additional options
 * @returns {Array} [debouncedValue, cancelDebounce, isPending]
 */
export const useDebounce = (value, delay = 300, options = {}) => {
  const {
    leading = false,  // Execute on leading edge
    trailing = true,  // Execute on trailing edge
    maxWait = null,   // Maximum wait time
    immediate = false // Execute immediately on first call
  } = options;

  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef(null);
  const maxTimeoutRef = useRef(null);
  const lastCallTimeRef = useRef(0);

  const cancelDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    setIsPending(false);
  }, []);

  const executeDebounce = useCallback((currentValue) => {
    setDebouncedValue(currentValue);
    setIsPending(false);
    cancelDebounce();
  }, [cancelDebounce]);

  useEffect(() => {
    const currentTime = Date.now();
    const timeSinceLastCall = currentTime - lastCallTimeRef.current;

    // Cancel previous timeout
    cancelDebounce();

    // Update last call time
    lastCallTimeRef.current = currentTime;

    // Immediate execution on first call
    if (immediate && lastCallTimeRef.current === 0) {
      executeDebounce(value);
      return;
    }

    // Leading edge execution
    if (leading && timeSinceLastCall >= delay) {
      executeDebounce(value);
      return;
    }

    // Set pending state
    setIsPending(true);

    // Main debounce timeout
    timeoutRef.current = setTimeout(() => {
      if (trailing) {
        executeDebounce(value);
      }
    }, delay);

    // Maximum wait timeout
    if (maxWait && maxWait > delay) {
      maxTimeoutRef.current = setTimeout(() => {
        executeDebounce(value);
      }, maxWait);
    }

    // Cleanup
    return cancelDebounce;
  }, [value, delay, leading, trailing, maxWait, immediate, executeDebounce, cancelDebounce]);

  // Cleanup on unmount
  useEffect(() => {
    return cancelDebounce;
  }, [cancelDebounce]);

  return [debouncedValue, cancelDebounce, isPending];
};

/**
 * Hook for debounced search with additional features
 * @param {Function} searchFunction - The search function to execute
 * @param {Object} options - Configuration options
 * @returns {Object} Search utilities
 */
export const useDebouncedSearch = (searchFunction, options = {}) => {
  const {
    debounceDelay = 300,
    minQueryLength = 2,
    enabled = true,
    onSuccess = null,
    onError = null,
    cacheResults = false,
    maxCacheSize = 100
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  // Debounced query
  const [debouncedQuery, cancelDebounce, isPending] = useDebounce(query, debounceDelay);

  // Clear cache if it gets too large
  const clearCache = useCallback(() => {
    if (cacheRef.current.size > maxCacheSize) {
      cacheRef.current.clear();
    }
  }, [maxCacheSize]);

  // Execute search
  const executeSearch = useCallback(async (searchQuery) => {
    if (!enabled || searchQuery.length < minQueryLength) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Check cache first
    if (cacheResults && cacheRef.current.has(searchQuery)) {
      setResults(cacheRef.current.get(searchQuery));
      setIsLoading(false);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await searchFunction(searchQuery, {
        signal: abortControllerRef.current.signal
      });

      // Check if request was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setResults(searchResults);
      setHasSearched(true);
      setError(null);

      // Cache results
      if (cacheResults) {
        clearCache();
        cacheRef.current.set(searchQuery, searchResults);
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(searchResults, searchQuery);
      }
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        return;
      }

      setError(err);
      setResults([]);

      // Call error callback
      if (onError) {
        onError(err, searchQuery);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enabled, minQueryLength, searchFunction, cacheResults, onSuccess, onError, clearCache]);

  // Trigger search when debounced query changes
  useEffect(() => {
    executeSearch(debouncedQuery);
  }, [debouncedQuery, executeSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const searchUtilities = {
    // State
    query,
    results,
    isLoading,
    error,
    hasSearched,
    isPending,
    
    // Actions
    setQuery,
    clearResults: () => setResults([]),
    clearError: () => setError(null),
    cancelSearch: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      cancelDebounce();
      setIsLoading(false);
    },
    clearCache,
    
    // Computed
    hasResults: results.length > 0,
    isEmpty: hasSearched && results.length === 0 && !isLoading,
    canSearch: query.length >= minQueryLength,
    
    // Cache info
    cacheSize: cacheRef.current.size
  };

  return searchUtilities;
};

/**
 * Hook for debounced API calls with retry logic
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} API utilities
 */
export const useDebouncedApi = (apiFunction, options = {}) => {
  const {
    debounceDelay = 500,
    retryAttempts = 3,
    retryDelay = 1000,
    enabled = true,
    onSuccess = null,
    onError = null
  } = options;

  const [trigger, setTrigger] = useState(0);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeApiCall = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    let lastError;
    
    for (let attempt = 0; attempt < retryAttempts; attempt++) {
      try {
        const result = await apiFunction();
        setData(result);
        setError(null);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return;
      } catch (err) {
        lastError = err;
        
        // Don't retry on certain errors
        if (err.status === 404 || err.status === 401) {
          break;
        }
        
        // Wait before retry
        if (attempt < retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        }
      }
    }

    setError(lastError);
    
    if (onError) {
      onError(lastError);
    }
  }, [enabled, apiFunction, retryAttempts, retryDelay, onSuccess, onError]);

  // Debounced trigger
  const [debouncedTrigger] = useDebounce(trigger, debounceDelay);

  useEffect(() => {
    if (debouncedTrigger > 0) {
      executeApiCall();
    }
  }, [debouncedTrigger, executeApiCall]);

  const apiUtilities = {
    // State
    data,
    isLoading,
    error,
    
    // Actions
    execute: () => setTrigger(prev => prev + 1),
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
      setTrigger(0);
    }
  };

  return apiUtilities;
};

export default useDebounce;
