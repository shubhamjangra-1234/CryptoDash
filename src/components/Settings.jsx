import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Palette, Globe } from 'lucide-react';

const SettingsPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full text-center p-8">
      <div className="mb-6">
        <SettingsIcon className="w-16 h-16 text-gray-600 mx-auto" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Settings Page
      </h2>
      
      <p className="text-gray-600 mb-6">
        Customize your CryptoDash experience
      </p>
      
      <div className="space-y-4 text-left">
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
          <Shield className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-800">Coming Soon</span>
        </div>
        
        <p className="text-xs text-gray-500">
          This feature will allow you to:
        </p>
        <ul className="text-xs text-gray-600 space-y-1 text-left">
          <li>• Configure notification preferences</li>
          <li>• Set default currency</li>
          <li>• Choose theme preferences</li>
          <li>• Manage privacy settings</li>
          <li>• Configure API settings</li>
        </ul>
      </div>
      
      <button 
        onClick={() => window.location.href = '/'}
        className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Return to Dashboard
      </button>
    </div>
  </div>
);

export default Settings;
