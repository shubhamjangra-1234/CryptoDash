/**
 * Code Splitting utilities for CryptoDash
 * Provides lazy loading with Suspense boundaries and error handling
 */

import { lazy, Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { ErrorFallback } from '../components/common/ErrorBoundary';
import { Skeleton } from '../components/ui/Skeleton';

// Loading component for different types
const LoadingComponents = {
  // Full page loading
  FullPage: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ),
  
  // Card loading
  Card: () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  ),
  
  // Table loading
  Table: () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
  
  // Chart loading
  Chart: () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
};

// Custom lazy loading with error boundary
export const createLazyComponent = (importFunc, options = {}) => {
  const {
    loadingComponent = 'FullPage',
    fallbackComponent = null,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const LazyComponent = lazy(() => {
    return importFunc()
      .catch(error => {
        console.error('Failed to load component:', error);
        
        // Retry logic
        if (retryCount > 0) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(createLazyComponent(importFunc, { ...options, retryCount: retryCount - 1 }));
            }, retryDelay);
          });
        }
        
        throw error;
      });
  });

  const LoadingComponent = LoadingComponents[loadingComponent] || LoadingComponents.FullPage;

  return (props) => (
    <Suspense fallback={<LoadingComponent />}>
      <ErrorBoundary fallback={fallbackComponent}>
        <LazyComponent {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

// Preload utility
export const preloadComponent = (importFunc) => {
  const component = importFunc();
  
  // Preload the component
  component.catch(error => {
    console.warn('Failed to preload component:', error);
  });
  
  return component;
};

// Lazy loaded components for CryptoDash
export const LazyComponents = {
  // Pages
  HomePage: createLazyComponent(() => import('../pages/HomePage')),
  CoinDetailPage: createLazyComponent(() => import('../pages/CoinDetailPage')),
  MarketsPage: createLazyComponent(() => import('../pages/MarketsPage')),
  PortfolioPage: createLazyComponent(() => import('../pages/PortfolioPage')),
  SettingsPage: createLazyComponent(() => import('../pages/SettingsPage')),
  
  // Components
  MarketChart: createLazyComponent(() => import('../components/MarketChart'), {
    loadingComponent: 'Chart'
  }),
  MarketTable: createLazyComponent(() => import('../components/MarketTable'), {
    loadingComponent: 'Table'
  }),
  PortfolioSummary: createLazyComponent(() => import('../components/PortfolioSummary'), {
    loadingComponent: 'Card'
  }),
  AdvancedFilters: createLazyComponent(() => import('../components/AdvancedFilters')),
  
  // Modals
  AddToPortfolioModal: createLazyComponent(() => import('../components/modals/AddToPortfolioModal')),
  SettingsModal: createLazyComponent(() => import('../components/modals/SettingsModal')),
  ConfirmModal: createLazyComponent(() => import('../components/modals/ConfirmModal'))
};

// Route-based code splitting
export const LazyRoutes = {
  // Public routes
  '/': LazyComponents.HomePage,
  '/markets': LazyComponents.MarketsPage,
  '/coin/:id': LazyComponents.CoinDetailPage,
  
  // Protected routes (would require auth)
  '/portfolio': LazyComponents.PortfolioPage,
  '/settings': LazyComponents.SettingsPage
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload home page components
  preloadComponent(() => import('../pages/HomePage'));
  preloadComponent(() => import('../components/MarketChart'));
  preloadComponent(() => import('../components/MarketTable'));
  
  // Preload common utilities
  preloadComponent(() => import('../utils/apiUtils'));
  preloadComponent(() => import('../utils/errorHandler'));
};

// Preload components based on user behavior
export const preloadOnInteraction = (componentKey, importFunc) => {
  let preloaded = false;
  
  return {
    onMouseEnter: () => {
      if (!preloaded) {
        preloadComponent(importFunc);
        preloaded = true;
      }
    },
    onFocus: () => {
      if (!preloaded) {
        preloadComponent(importFunc);
        preloaded = true;
      }
    }
  };
};

// Intersection observer for lazy loading
export const useIntersectionPreload = (importFunc, options = {}) => {
  const { threshold = 0.1, rootMargin = '100px' } = options;
  const [ref, setRef] = useState(null);
  const [preloaded, setPreloaded] = useState(false);

  useEffect(() => {
    if (!ref || preloaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadComponent(importFunc);
            setPreloaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, preloaded, importFunc, threshold, rootMargin]);

  return [setRef, preloaded];
};

// Network-aware preloading
export const useNetworkAwarePreload = (importFunc, options = {}) => {
  const { minConnectionType = '4g' } = options;
  const [shouldPreload, setShouldPreload] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const { effectiveType, saveData } = connection;
        
        // Don't preload on slow connections or data saver mode
        if (saveData || (effectiveType && effectiveType !== minConnectionType)) {
          setShouldPreload(false);
          return;
        }
      }
      
      setShouldPreload(true);
    };

    checkConnection();
    
    // Listen for connection changes
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', checkConnection);
    }

    return () => {
      if (connection) {
        connection.removeEventListener('change', checkConnection);
      }
    };
  }, [minConnectionType]);

  const preload = useCallback(() => {
    if (shouldPreload) {
      preloadComponent(importFunc);
    }
  }, [shouldPreload, importFunc]);

  return { shouldPreload, preload };
};

// Bundle size monitoring
export const useBundleSizeMonitor = () => {
  const [bundleInfo, setBundleInfo] = useState(null);

  useEffect(() => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const entries = performance.getEntriesByType('navigation');
      
      if (entries.length > 0) {
        const navigation = entries[0];
        const transferSize = navigation.transferSize || 0;
        const encodedBodySize = navigation.encodedBodySize || 0;
        
        setBundleInfo({
          transferSize: (transferSize / 1024 / 1024).toFixed(2) + ' MB',
          encodedBodySize: (encodedBodySize / 1024 / 1024).toFixed(2) + ' MB',
          loadTime: navigation.loadEventEnd - navigation.loadEventStart
        });
      }
    }
  }, []);

  return bundleInfo;
};

export default {
  createLazyComponent,
  preloadComponent,
  LazyComponents,
  LazyRoutes,
  preloadCriticalComponents,
  preloadOnInteraction,
  useIntersectionPreload,
  useNetworkAwarePreload,
  useBundleSizeMonitor
};
