import React from 'react';
import { Home, Search } from 'lucide-react';

const NotFound = () => (
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

export default NotFound;
