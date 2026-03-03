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
          <div className="mb-4 mx-auto">
            <div className="flex items-center justify-center h-16 w-16 mx-auto">
              <svg viewBox="0 0 512 512" className='h-8 w-8'  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fxemoji" preserveAspectRatio="xMidYMid meet" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path fill="#FFB636" d="M12.51 470.379L234.371 16.008c6.439-13.187 25.17-13.363 31.855-.299l232.51 454.371c6.064 11.849-2.542 25.92-15.853 25.92H28.512c-13.164 0-21.778-13.791-16.002-25.621z"></path>
                  <path fill="#2B3B47" d="M284.332 173L272.15 336.498c-.911 12.233-11.567 21.411-23.8 20.499c-11.116-.828-19.706-9.707-20.499-20.499L215.668 173c-1.413-18.961 12.813-35.478 31.774-36.89s35.478 12.813 36.89 31.774c.124 1.662.109 3.5 0 5.116zM250 391.873c-17.432 0-31.564 14.131-31.564 31.564C218.436 440.869 232.568 455 250 455s31.564-14.131 31.564-31.564c0-17.432-14.132-31.563-31.564-31.563z"></path>
                </g>
              </svg>
            </div>
          </div>
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
