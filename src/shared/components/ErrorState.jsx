import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const ErrorState = React.memo(({ 
  error, 
  onRetry = null,
  title = "Something went wrong",
  description = null,
  className = ""
}) => {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.error_message) return error.response.data.error_message;
    return 'An unexpected error occurred';
  };

  const getErrorCode = (error) => {
    if (error?.response?.status) return error.response.status;
    if (error?.error_code) return error.error_code;
    return null;
  };

  const errorCode = getErrorCode(error);
  const errorMessage = getErrorMessage(error);

  return (
    <Card className={className}>
      <CardContent className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
          
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 font-mono">
              {errorCode && `Error ${errorCode}: `}{errorMessage}
            </p>
          </div>

          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;
