import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Server, Globe } from 'lucide-react';

const NetworkErrorUI = ({ 
  type = 'network', 
  onRetry, 
  isRetrying = false,
  retryCount = 0,
  maxRetries = 3
}) => {
  const getErrorConfig = (errorType) => {
    switch (errorType) {
      case 'network':
        return {
          icon: <WifiOff className="w-16 h-16 text-red-500" />,
          title: 'Network Connection Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          suggestions: [
            'Check your internet connection',
            'Try refreshing the page',
            'Contact your network administrator if the issue persists'
          ]
        };
      
      case 'server':
        return {
          icon: <Server className="w-16 h-16 text-orange-500" />,
          title: 'Server Error',
          description: 'Our servers are experiencing issues. We\'re working to fix this.',
          suggestions: [
            'Try again in a few minutes',
            'Check our status page for updates',
            'Contact support if the issue continues'
          ]
        };
      
      case 'api':
        return {
          icon: <Globe className="w-16 h-16 text-yellow-500" />,
          title: 'API Unavailable',
          description: 'The cryptocurrency data service is temporarily unavailable.',
          suggestions: [
            'Try again in a few minutes',
            'Some data may be cached and available',
            'Check CoinGecko status for API issues'
          ]
        };
      
      case 'empty':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-gray-400" />,
          title: 'No Data Available',
          description: 'No cryptocurrency data is currently available.',
          suggestions: [
            'Try refreshing the page',
            'Check if the API service is operational',
            'Data may be temporarily unavailable'
          ]
        };
      
      default:
        return {
          icon: <AlertTriangle className="w-16 h-16 text-red-500" />,
          title: 'Something Went Wrong',
          description: 'An unexpected error occurred while loading data.',
          suggestions: [
            'Try refreshing the page',
            'Check your internet connection',
            'Contact support if the issue persists'
          ]
        };
    }
  };

  const config = getErrorConfig(type);
  const canRetry = retryCount < maxRetries;
  const retryButtonText = isRetrying ? 'Retrying...' : canRetry ? 'Retry' : 'Max Retries Reached';

  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
      <div className="max-w-md w-full text-center p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {config.icon}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {config.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {config.description}
        </p>

        {/* Suggestions */}
        <div className="text-left mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">What you can try:</h3>
          <ul className="space-y-2">
            {config.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <div className="space-y-3">
            <button
              onClick={onRetry}
              disabled={!canRetry || isRetrying}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                canRetry && !isRetrying
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {retryButtonText}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  {retryButtonText}
                </>
              )}
            </button>

            {/* Retry Count */}
            {retryCount > 0 && (
              <p className="text-xs text-gray-500">
                Retry attempts: {retryCount} of {maxRetries}
              </p>
            )}
          </div>
        )}

        {/* Status Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            type === 'network' ? 'bg-red-500' : 
            type === 'server' ? 'bg-orange-500' : 
            type === 'api' ? 'bg-yellow-500' : 'bg-gray-400'
          }`} />
          <span className="text-xs text-gray-500">
            {type === 'network' ? 'Offline' : 
             type === 'server' ? 'Server Issue' : 
             type === 'api' ? 'API Issue' : 'No Data'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Empty State Component for when data is available but empty
export const EmptyStateUI = ({ 
  message = 'No data available', 
  description = 'There are no items to display at the moment.',
  icon = <AlertTriangle className="w-12 h-12 text-gray-400" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-500 text-sm max-w-md">
        {description}
      </p>
    </div>
  );
};

// Loading State Component
export const LoadingStateUI = ({ message = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};

export default NetworkErrorUI;
