import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ErrorBoundary, { ErrorFallback } from '../components/common/ErrorBoundary';

// Import pages (dumb components)
import DashboardPage from '../pages/dashboard/Dashboard';
import MarketsPage from '../pages/markets/markets';
import CoinDetailPage from '../modules/coin-detail/pages/CoinDetailPage';
import CategoriesPage from '../pages/categories/categories';
import CategoryDetailPage from '../modules/Categories/pages/CategoryDetailPage';
import ExchangesPage from '../pages/exchanges/exchanges';
// import ExchangeDetailPage from '../modules/Exchanges/pages/ExchangeDetailPage';
import Dashboard from '../pages/dashboard/Dashboard';
import DummyDash from '../modules/crypto/pages/DashboardPage';

// Placeholder components for future features
const Portfolio = () => <div>Portfolio Page - Coming Soon</div>;
const Settings = () => <div>Settings Page - Coming Soon</div>;
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">Page not found</p>
      <a 
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

// Wrap components with error boundaries
const SafeDashboardPage = () => (
  <ErrorBoundary>
    <DashboardPage/>
  </ErrorBoundary>
);

const SafeMarketsPage = () => (
  <ErrorBoundary>
    <MarketsPage />
  </ErrorBoundary>
);

const SafeCoinDetailPage = () => (
  <ErrorBoundary>
    <CoinDetailPage />
  </ErrorBoundary>
);

const SafeCategoriesPage = () => (
  <ErrorBoundary>
    <CategoriesPage />
  </ErrorBoundary>
);

const SafeCategoryDetailPage = () => (
  <ErrorBoundary>
    <CategoryDetailPage />
  </ErrorBoundary>
);

const SafeExchangesPage = () => (
  <ErrorBoundary>
    <ExchangesPage />
  </ErrorBoundary>
);

const SafePortfolio = () => (
  <ErrorBoundary>
    <Portfolio />
  </ErrorBoundary>
);

const SafeSettings = () => (
  <ErrorBoundary>
    <Settings />
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
        element: <SafeSettings />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'dummy',
        element: <DummyDash />,
        errorElement: <ErrorFallback />
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
