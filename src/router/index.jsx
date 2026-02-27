import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CryptoDashboard from '../pages/Index/Index';
import ErrorBoundary, { ErrorFallback } from '../components/common/ErrorBoundary';

// Route components - these will be created later
const Coins = () => <div>Coins Page</div>;
const CoinDetails = () => <div>Coin Details Page</div>;
const Portfolio = () => <div>Portfolio Page</div>;
const Settings = () => <div>Settings Page</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

// Wrap components with error boundaries
const SafeCryptoDashboard = () => (
  <ErrorBoundary>
    <CryptoDashboard />
  </ErrorBoundary>
);

const SafeCoins = () => (
  <ErrorBoundary>
    <Coins />
  </ErrorBoundary>
);

const SafeCoinDetails = () => (
  <ErrorBoundary>
    <CoinDetails />
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
        element: <SafeCryptoDashboard />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'coins',
        element: <SafeCoins />,
        errorElement: <ErrorFallback />
      },
      {
        path: 'coins/:id',
        element: <SafeCoinDetails />,
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
