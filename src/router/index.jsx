import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/layout/Layout';
import ErrorBoundary, { ErrorFallback } from '../components/common/ErrorBoundary';
import LoadingSkeleton from '../shared/components/LoadingSkeleton';

// Lazy load pages to reduce bundle size
const DashboardPage = lazy(() => import('../pages/dashboard/Dashboard'));
const MarketsPage = lazy(() => import('../pages/markets/markets'));
const CoinDetailPage = lazy(() => import('../modules/coin-detail/pages/CoinDetailPage'));
const CategoriesPage = lazy(() => import('../pages/categories/categories'));
const CategoryDetailPage = lazy(() => import('../modules/Categories/pages/CategoryDetailPage'));
const ExchangesPage = lazy(() => import('../pages/exchanges/exchanges'));
const DummyDash = lazy(() => import('../modules/crypto/pages/DashboardPage'));

// Placeholder components for future features
const Portfolio = lazy(() => import('../components/Portfolio'));
const SettingsPage = lazy(() => import('../components/Settings'));
const NotFound = lazy(() => import('../components/NotFound'));

const NotFoundComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full text-center p-8">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-gray-500">404</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Page Not Found
      </h2>
      
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="space-y-3">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Dashboard
        </button>
        
        <button 
          onClick={() => window.history.back()}
          className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  </div>
);

// Wrap components with error boundaries and suspense for lazy loading
const SafeDashboardPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSkeleton type="dashboard" />}>
      <DashboardPage/>
    </Suspense>
  </ErrorBoundary>
);

const SafeMarketsPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSkeleton type="dashboard" />}>
      <MarketsPage />
    </Suspense>
  </ErrorBoundary>
);

const SafeCoinDetailPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSkeleton />}>
      <CoinDetailPage />
    </Suspense>
  </ErrorBoundary>
);

const SafeCategoriesPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSkeleton type="dashboard" />}>
      <CategoriesPage />
    </Suspense>
  </ErrorBoundary>
);

const SafeCategoryDetailPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSkeleton />}>
      <CategoryDetailPage />
    </Suspense>
  </ErrorBoundary>
);

const SafeExchangesPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSkeleton type="dashboard" />}>
      <ExchangesPage />
    </Suspense>
  </ErrorBoundary>
);

const SafePortfolio = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSkeleton />}>
      <Portfolio />
    </Suspense>
  </ErrorBoundary>
);

const SafeSettingsPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSkeleton />}>
      <SettingsPage />
    </Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <SafeDashboardPage />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'dashboard',
        element: <SafeDashboardPage />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'markets',
        element: <SafeMarketsPage />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'coin/:id',
        element: <SafeCoinDetailPage />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'categories',
        element: <SafeCategoriesPage />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'categories/:categoryId',
        element: <SafeCategoryDetailPage />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'exchanges',
        element: <SafeExchangesPage />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'portfolio',
        element: <SafePortfolio />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'settings',
        element: <SafeSettingsPage />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'dummy',
        element: <DummyDash />,
        errorElement: <ErrorFallback />
      },
      {
        path: '*',
        element: <Suspense fallback={<LoadingSkeleton />}><NotFoundComponent /></Suspense>,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
