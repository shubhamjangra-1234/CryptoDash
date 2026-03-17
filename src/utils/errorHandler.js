import { toast } from 'react-hot-toast';

// Error types for centralized handling
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error messages mapping
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK_ERROR]: {
    title: 'Network Error',
    message: 'Please check your internet connection and try again.',
    duration: 5000
  },
  [ERROR_TYPES.RATE_LIMIT]: {
    title: 'Rate Limit Exceeded',
    message: 'Too many requests. Please wait a moment and try again.',
    duration: 8000
  },
  [ERROR_TYPES.NOT_FOUND]: {
    title: 'Not Found',
    message: 'The requested resource was not found.',
    duration: 4000
  },
  [ERROR_TYPES.UNAUTHORIZED]: {
    title: 'Unauthorized',
    message: 'You are not authorized to access this resource.',
    duration: 4000
  },
  [ERROR_TYPES.SERVER_ERROR]: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    duration: 6000
  },
  [ERROR_TYPES.VALIDATION_ERROR]: {
    title: 'Validation Error',
    message: 'Please check your input and try again.',
    duration: 4000
  },
  [ERROR_TYPES.UNKNOWN_ERROR]: {
    title: 'Error',
    message: 'An unexpected error occurred. Please try again.',
    duration: 4000
  }
};

// Determine error type from error response
export const getErrorType = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN_ERROR;

  // Network errors
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return ERROR_TYPES.NETWORK_ERROR;
  }

  // HTTP status codes
  const status = error.response?.status;
  
  switch (status) {
    case 429:
      return ERROR_TYPES.RATE_LIMIT;
    case 404:
      return ERROR_TYPES.NOT_FOUND;
    case 401:
    case 403:
      return ERROR_TYPES.UNAUTHORIZED;
    case 400:
      return ERROR_TYPES.VALIDATION_ERROR;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_TYPES.SERVER_ERROR;
    default:
      return ERROR_TYPES.UNKNOWN_ERROR;
  }
};

// Extract user-friendly message from error
export const getErrorMessage = (error, errorType) => {
  // Check for custom message from API
  const apiMessage = error.response?.data?.message || error.response?.data?.error;
  
  if (apiMessage && typeof apiMessage === 'string') {
    return apiMessage;
  }

  // Use predefined message
  return ERROR_MESSAGES[errorType]?.message || ERROR_MESSAGES.UNKNOWN_ERROR.message;
};

// Show error toast
export const showErrorToast = (error, options = {}) => {
  const errorType = getErrorType(error);
  const message = getErrorMessage(error, errorType);
  const config = ERROR_MESSAGES[errorType] || ERROR_MESSAGES.UNKNOWN_ERROR;
  
  return toast.error(message, {
    duration: config.duration,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#ffffff',
      border: '1px solid #dc2626',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Show success toast
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#ffffff',
      border: '1px solid #059669',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Show info toast
export const showInfoToast = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#ffffff',
      border: '1px solid #2563eb',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Show loading toast
export const showLoadingToast = (message, options = {}) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6366f1',
      color: '#ffffff',
      border: '1px solid #4f46e5',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Error boundary fallback component - moved to components/ui/ErrorBoundary.jsx
export const createErrorFallback = () => {
  // This function returns the component configuration
  // The actual component is in components/ui/ErrorBoundary.jsx
  return {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    showRetry: true,
    showReload: true
  };
};

// Global error handler for unhandled errors
export const setupGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    showErrorToast(event.reason);
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught Error:', event.error);
    showErrorToast(event.error);
  });
};

// Retry mechanism with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      const errorType = getErrorType(error);
      if ([ERROR_TYPES.NOT_FOUND, ERROR_TYPES.UNAUTHORIZED, ERROR_TYPES.VALIDATION_ERROR].includes(errorType)) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Export all error handling utilities
export const errorHandler = {
  showErrorToast,
  showSuccessToast,
  showInfoToast,
  showLoadingToast,
  setupGlobalErrorHandler,
  retryWithBackoff,
  getErrorType,
  getErrorMessage,
  ERROR_TYPES
};

export default errorHandler;
