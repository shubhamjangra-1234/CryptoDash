import React from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';

const Portfolio = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full text-center p-8">
      <div className="mb-6">
        <Briefcase className="w-16 h-16 text-blue-500 mx-auto" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Portfolio Page
      </h2>
      
      <p className="text-gray-600 mb-6">
        Track your cryptocurrency portfolio performance
      </p>
      
      <div className="space-y-4 text-left">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-800">Coming Soon</span>
        </div>
        
        <p className="text-xs text-gray-500">
          This feature will allow you to:
        </p>
        <ul className="text-xs text-gray-600 space-y-1 text-left">
          <li>• Track your crypto holdings</li>
          <li>• Monitor portfolio performance</li>
          <li>• Calculate profit/loss</li>
          <li>• Set price alerts</li>
        </ul>
      </div>
      
      <button 
        onClick={() => window.location.href = '/'}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Dashboard
      </button>
    </div>
  </div>
);

export default Portfolio;
