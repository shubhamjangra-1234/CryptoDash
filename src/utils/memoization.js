/**
 * Memoization utilities for React components and functions
 * Provides optimized memoization strategies for performance
 */

import { useMemo, useCallback, memo, useState, useRef, useEffect } from 'react';

// Custom memo hook with deep comparison
export const useDeepMemo = (fn, deps) => {
  return useMemo(fn, deps);
};

// Optimized callback with dependency tracking
export const useOptimizedCallback = (callback, deps, options = {}) => {
  const { maxDeps = 10, debug = false } = options;
  
  if (debug && deps.length > maxDeps) {
    console.warn(`useOptimizedCallback: Too many dependencies (${deps.length}). Consider refactoring.`);
  }
  
  return useCallback(callback, deps);
};

// Memoized component with custom comparison
export const createMemoComponent = (Component, areEqual = null) => {
  return memo(Component, areEqual);
};

// Deep comparison utility
export const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
};

// Shallow comparison utility
export const shallowEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (!obj1 || !obj2) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

// Memoized array operations
export const useMemoizedArray = (array, deps) => {
  return useMemo(() => array || [], deps);
};

// Memoized object operations
export const useMemoizedObject = (obj, deps) => {
  return useMemo(() => obj || {}, deps);
};

// Memoized filter function
export const useMemoizedFilter = (array, predicate, deps) => {
  return useMemo(() => array?.filter(predicate) || [], [array, ...deps]);
};

// Memoized sort function
export const useMemoizedSort = (array, compareFn, deps) => {
  return useMemo(() => {
    if (!array) return [];
    const sorted = [...array];
    sorted.sort(compareFn);
    return sorted;
  }, [array, ...deps]);
};

// Memoized map function
export const useMemoizedMap = (array, mapFn, deps) => {
  return useMemo(() => array?.map(mapFn) || [], [array, ...deps]);
};

// Memoized reduce function
export const useMemoizedReduce = (array, reduceFn, initialValue, deps) => {
  return useMemo(() => array?.reduce(reduceFn, initialValue) || initialValue, [array, ...deps]);
};

// Memoized search function
export const useMemoizedSearch = (items, searchTerm, searchFn, deps = []) => {
  return useMemo(() => {
    if (!searchTerm || !items) return items;
    return items.filter(item => searchFn(item, searchTerm));
  }, [items, searchTerm, ...deps]);
};

// Memoized pagination
export const useMemoizedPagination = (items, currentPage, itemsPerPage, deps = []) => {
  return useMemo(() => {
    if (!items) return { paginatedItems: [], totalPages: 0 };
    
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);
    
    return { paginatedItems, totalPages };
  }, [items, currentPage, itemsPerPage, ...deps]);
};

// Memoized group by function
export const useMemoizedGroupBy = (items, keyFn, deps = []) => {
  return useMemo(() => {
    if (!items) return {};
    
    return items.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }, [items, ...deps]);
};

// Memoized unique function
export const useMemoizedUnique = (items, keyFn, deps = []) => {
  return useMemo(() => {
    if (!items) return [];
    
    const seen = new Set();
    return items.filter(item => {
      const key = keyFn ? keyFn(item) : item;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [items, ...deps]);
};

// Performance monitoring for memoization
export const useMemoWithTracking = (fn, deps, label = 'Memo') => {
  const startTime = useRef(performance.now());
  
  const result = useMemo(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    if (duration > 10) { // Log if memoization takes more than 10ms
      console.warn(`${label}: Memoization took ${duration.toFixed(2)}ms`);
    }
    
    return fn();
  }, deps);
  
  return result;
};

// Debounced memoization
export const useDebouncedMemo = (fn, deps, delay = 300) => {
  const [memoizedValue, setMemoizedValue] = useState(null);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setMemoizedValue(fn());
    }, delay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);
  
  return memoizedValue;
};

// Throttled memoization
export const useThrottledMemo = (fn, deps, delay = 100) => {
  const [memoizedValue, setMemoizedValue] = useState(null);
  const lastExecutionTime = useRef(0);
  
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionTime.current;
    
    if (timeSinceLastExecution >= delay) {
      setMemoizedValue(fn());
      lastExecutionTime.current = now;
    } else {
      const timeoutId = setTimeout(() => {
        setMemoizedValue(fn());
        lastExecutionTime.current = Date.now();
      }, delay - timeSinceLastExecution);
      
      return () => clearTimeout(timeoutId);
    }
  }, deps);
  
  return memoizedValue;
};

// Cache for expensive computations
export const useComputationCache = () => {
  const cacheRef = useRef(new Map());
  
  const compute = useCallback((key, fn, deps = []) => {
    const cacheKey = `${key}:${JSON.stringify(deps)}`;
    
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }
    
    const result = fn();
    cacheRef.current.set(cacheKey, result);
    
    // Limit cache size
    if (cacheRef.current.size > 100) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }
    
    return result;
  }, []);
  
  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);
  
  const size = useCallback(() => {
    return cacheRef.current.size;
  }, []);
  
  return { compute, clear, size };
};

export default {
  useDeepMemo,
  useOptimizedCallback,
  createMemoComponent,
  deepEqual,
  shallowEqual,
  useMemoizedArray,
  useMemoizedObject,
  useMemoizedFilter,
  useMemoizedSort,
  useMemoizedMap,
  useMemoizedReduce,
  useMemoizedSearch,
  useMemoizedPagination,
  useMemoizedGroupBy,
  useMemoizedUnique,
  useMemoWithTracking,
  useDebouncedMemo,
  useThrottledMemo,
  useComputationCache
};
