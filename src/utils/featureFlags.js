/**
 * Feature Flags System for CryptoDash
 * Provides centralized feature management with environment-based configuration
 */

import { useState, useEffect } from 'react';

// Feature flag definitions
export const FEATURE_FLAGS = {
  // Real-time features
  WEBSOCKET_UPDATES: 'websocket_updates',
  REAL_TIME_PRICES: 'real_time_prices',
  
  // Advanced features
  ADVANCED_CHARTS: 'advanced_charts',
  TECHNICAL_ANALYSIS: 'technical_analysis',
  PORTFOLIO_TRACKER: 'portfolio_tracker',
  PRICE_ALERTS: 'price_alerts',
  
  // UI features
  DARK_MODE: 'dark_mode',
  COMPACT_VIEW: 'compact_view',
  INFINITE_SCROLL: 'infinite_scroll',
  VIRTUALIZATION: 'virtualization',
  
  // Experimental features
  AI_INSIGHTS: 'ai_insights',
  SOCIAL_INTEGRATION: 'social_integration',
  GAMIFICATION: 'gamification',
  
  // Performance features
  AGGRESSIVE_CACHING: 'aggressive_caching',
  PRELOAD_DATA: 'preload_data',
  BACKGROUND_SYNC: 'background_sync',
  
  // Debug features
  DEBUG_MODE: 'debug_mode',
  PERFORMANCE_MONITORING: 'performance_monitoring',
  ERROR_BOUNDARIES: 'error_boundaries'
};

// Environment-based configuration
const ENV_FEATURE_CONFIG = {
  development: {
    // Enable all features in development
    [FEATURE_FLAGS.WEBSOCKET_UPDATES]: true,
    [FEATURE_FLAGS.REAL_TIME_PRICES]: true,
    [FEATURE_FLAGS.ADVANCED_CHARTS]: true,
    [FEATURE_FLAGS.TECHNICAL_ANALYSIS]: true,
    [FEATURE_FLAGS.PORTFOLIO_TRACKER]: true,
    [FEATURE_FLAGS.PRICE_ALERTS]: true,
    [FEATURE_FLAGS.DARK_MODE]: true,
    [FEATURE_FLAGS.COMPACT_VIEW]: true,
    [FEATURE_FLAGS.INFINITE_SCROLL]: true,
    [FEATURE_FLAGS.VIRTUALIZATION]: true,
    [FEATURE_FLAGS.AI_INSIGHTS]: true,
    [FEATURE_FLAGS.SOCIAL_INTEGRATION]: true,
    [FEATURE_FLAGS.GAMIFICATION]: true,
    [FEATURE_FLAGS.AGGRESSIVE_CACHING]: true,
    [FEATURE_FLAGS.PRELOAD_DATA]: true,
    [FEATURE_FLAGS.BACKGROUND_SYNC]: true,
    [FEATURE_FLAGS.DEBUG_MODE]: true,
    [FEATURE_FLAGS.PERFORMANCE_MONITORING]: true,
    [FEATURE_FLAGS.ERROR_BOUNDARIES]: true
  },
  
  staging: {
    // Enable most features in staging
    [FEATURE_FLAGS.WEBSOCKET_UPDATES]: true,
    [FEATURE_FLAGS.REAL_TIME_PRICES]: true,
    [FEATURE_FLAGS.ADVANCED_CHARTS]: true,
    [FEATURE_FLAGS.TECHNICAL_ANALYSIS]: false,
    [FEATURE_FLAGS.PORTFOLIO_TRACKER]: true,
    [FEATURE_FLAGS.PRICE_ALERTS]: true,
    [FEATURE_FLAGS.DARK_MODE]: true,
    [FEATURE_FLAGS.COMPACT_VIEW]: true,
    [FEATURE_FLAGS.INFINITE_SCROLL]: true,
    [FEATURE_FLAGS.VIRTUALIZATION]: true,
    [FEATURE_FLAGS.AI_INSIGHTS]: false,
    [FEATURE_FLAGS.SOCIAL_INTEGRATION]: false,
    [FEATURE_FLAGS.GAMIFICATION]: false,
    [FEATURE_FLAGS.AGGRESSIVE_CACHING]: true,
    [FEATURE_FLAGS.PRELOAD_DATA]: true,
    [FEATURE_FLAGS.BACKGROUND_SYNC]: true,
    [FEATURE_FLAGS.DEBUG_MODE]: false,
    [FEATURE_FLAGS.PERFORMANCE_MONITORING]: true,
    [FEATURE_FLAGS.ERROR_BOUNDARIES]: true
  },
  
  production: {
    // Enable only stable features in production
    [FEATURE_FLAGS.WEBSOCKET_UPDATES]: false,
    [FEATURE_FLAGS.REAL_TIME_PRICES]: false,
    [FEATURE_FLAGS.ADVANCED_CHARTS]: true,
    [FEATURE_FLAGS.TECHNICAL_ANALYSIS]: false,
    [FEATURE_FLAGS.PORTFOLIO_TRACKER]: true,
    [FEATURE_FLAGS.PRICE_ALERTS]: true,
    [FEATURE_FLAGS.DARK_MODE]: true,
    [FEATURE_FLAGS.COMPACT_VIEW]: true,
    [FEATURE_FLAGS.INFINITE_SCROLL]: true,
    [FEATURE_FLAGS.VIRTUALIZATION]: true,
    [FEATURE_FLAGS.AI_INSIGHTS]: false,
    [FEATURE_FLAGS.SOCIAL_INTEGRATION]: false,
    [FEATURE_FLAGS.GAMIFICATION]: false,
    [FEATURE_FLAGS.AGGRESSIVE_CACHING]: true,
    [FEATURE_FLAGS.PRELOAD_DATA]: false,
    [FEATURE_FLAGS.BACKGROUND_SYNC]: false,
    [FEATURE_FLAGS.DEBUG_MODE]: false,
    [FEATURE_FLAGS.PERFORMANCE_MONITORING]: false,
    [FEATURE_FLAGS.ERROR_BOUNDARIES]: true
  },
  
  test: {
    // Minimal features for testing
    [FEATURE_FLAGS.DARK_MODE]: true,
    [FEATURE_FLAGS.ERROR_BOUNDARIES]: true,
    // All other features disabled
    [FEATURE_FLAGS.WEBSOCKET_UPDATES]: false,
    [FEATURE_FLAGS.REAL_TIME_PRICES]: false,
    [FEATURE_FLAGS.ADVANCED_CHARTS]: false,
    [FEATURE_FLAGS.TECHNICAL_ANALYSIS]: false,
    [FEATURE_FLAGS.PORTFOLIO_TRACKER]: false,
    [FEATURE_FLAGS.PRICE_ALERTS]: false,
    [FEATURE_FLAGS.COMPACT_VIEW]: false,
    [FEATURE_FLAGS.INFINITE_SCROLL]: false,
    [FEATURE_FLAGS.VIRTUALIZATION]: false,
    [FEATURE_FLAGS.AI_INSIGHTS]: false,
    [FEATURE_FLAGS.SOCIAL_INTEGRATION]: false,
    [FEATURE_FLAGS.GAMIFICATION]: false,
    [FEATURE_FLAGS.AGGRESSIVE_CACHING]: false,
    [FEATURE_FLAGS.PRELOAD_DATA]: false,
    [FEATURE_FLAGS.BACKGROUND_SYNC]: false,
    [FEATURE_FLAGS.DEBUG_MODE]: false,
    [FEATURE_FLAGS.PERFORMANCE_MONITORING]: false
  }
};

// User-specific feature overrides (for A/B testing, premium features, etc.)
const USER_FEATURE_OVERRIDES = {
  // Example: Premium users get access to advanced features
  // 'premium_user_id': {
  //   [FEATURE_FLAGS.AI_INSIGHTS]: true,
  //   [FEATURE_FLAGS.TECHNICAL_ANALYSIS]: true,
  //   [FEATURE_FLAGS.SOCIAL_INTEGRATION]: true
  // }
};

// Get current environment
const getEnvironment = () => {
  return import.meta.env?.MODE || 'development';
};

// Get current user (mock implementation)
const getCurrentUser = () => {
  // In a real app, this would get the current user from auth context
  return {
    id: 'default_user',
    role: 'free',
    features: []
  };
};

// Feature flag manager class
class FeatureFlagManager {
  constructor() {
    this.environment = getEnvironment();
    this.currentUser = getCurrentUser();
    this.baseConfig = ENV_FEATURE_CONFIG[this.environment] || ENV_FEATURE_CONFIG.development;
    this.userOverrides = USER_FEATURE_OVERRIDES[this.currentUser.id] || {};
    this.listeners = new Map();
  }

  // Check if a feature is enabled
  isEnabled(featureFlag) {
    // Check user overrides first
    if (this.userOverrides.hasOwnProperty(featureFlag)) {
      return this.userOverrides[featureFlag];
    }

    // Check environment configuration
    if (this.baseConfig.hasOwnProperty(featureFlag)) {
      return this.baseConfig[featureFlag];
    }

    // Check environment variables for runtime overrides
    const envVar = import.meta.env[`VITE_FEATURE_${featureFlag.toUpperCase()}`];
    if (envVar !== undefined) {
      return envVar === 'true' || envVar === '1';
    }

    // Default to disabled
    return false;
  }

  // Get all enabled features
  getEnabledFeatures() {
    return Object.entries(this.baseConfig)
      .filter(([feature, enabled]) => {
        const userOverride = this.userOverrides[feature];
        return userOverride !== undefined ? userOverride : enabled;
      })
      .map(([feature]) => feature);
  }

  // Get all disabled features
  getDisabledFeatures() {
    return Object.entries(this.baseConfig)
      .filter(([feature, enabled]) => {
        const userOverride = this.userOverrides[feature];
        return userOverride !== undefined ? !userOverride : !enabled;
      })
      .map(([feature]) => feature);
  }

  // Check if multiple features are enabled
  areEnabled(featureFlags) {
    return featureFlags.every(flag => this.isEnabled(flag));
  }

  // Check if any of multiple features are enabled
  areAnyEnabled(featureFlags) {
    return featureFlags.some(flag => this.isEnabled(flag));
  }

  // Add feature change listener
  addListener(featureFlag, callback) {
    if (!this.listeners.has(featureFlag)) {
      this.listeners.set(featureFlag, []);
    }
    this.listeners.get(featureFlag).push(callback);
  }

  // Remove feature change listener
  removeListener(featureFlag, callback) {
    const callbacks = this.listeners.get(featureFlag);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify listeners of feature change
  notifyListeners(featureFlag, newValue) {
    const callbacks = this.listeners.get(featureFlag);
    if (callbacks) {
      callbacks.forEach(callback => callback(featureFlag, newValue));
    }
  }

  // Override feature value (for testing or admin purposes)
  overrideFeature(featureFlag, value) {
    this.userOverrides[featureFlag] = value;
    this.notifyListeners(featureFlag, value);
  }

  // Clear feature override
  clearOverride(featureFlag) {
    delete this.userOverrides[featureFlag];
    const baseValue = this.baseConfig[featureFlag] || false;
    this.notifyListeners(featureFlag, baseValue);
  }

  // Get feature configuration
  getFeatureConfig() {
    return {
      environment: this.environment,
      user: this.currentUser,
      baseConfig: this.baseConfig,
      userOverrides: this.userOverrides,
      enabledFeatures: this.getEnabledFeatures(),
      disabledFeatures: this.getDisabledFeatures()
    };
  }

  // Export configuration for debugging
  exportConfig() {
    return JSON.stringify(this.getFeatureConfig(), null, 2);
  }
}

// Create singleton instance
const featureFlagManager = new FeatureFlagManager();

// Development helper - expose to window
if (typeof window !== 'undefined' && getEnvironment() === 'development') {
  window.featureFlags = featureFlagManager;
  window.FEATURE_FLAGS = FEATURE_FLAGS;
}

// Custom hook for feature flags
export const useFeatureFlag = (featureFlag) => {
  const [isEnabled, setIsEnabled] = useState(() => featureFlagManager.isEnabled(featureFlag));

  useEffect(() => {
    const callback = (flag, newValue) => {
      if (flag === featureFlag) {
        setIsEnabled(newValue);
      }
    };

    featureFlagManager.addListener(featureFlag, callback);

    return () => {
      featureFlagManager.removeListener(featureFlag, callback);
    };
  }, [featureFlag]);

  return isEnabled;
};

// Custom hook for multiple feature flags
export const useFeatureFlags = (featureFlags) => {
  const [enabledFlags, setEnabledFlags] = useState(() => {
    return featureFlags.reduce((acc, flag) => {
      acc[flag] = featureFlagManager.isEnabled(flag);
      return acc;
    }, {});
  });

  useEffect(() => {
    const callbacks = featureFlags.map(flag => {
      const callback = (changedFlag, newValue) => {
        if (featureFlags.includes(changedFlag)) {
          setEnabledFlags(prev => ({
            ...prev,
            [changedFlag]: newValue
          }));
        }
      };

      featureFlagManager.addListener(flag, callback);
      return { flag, callback };
    });

    return () => {
      callbacks.forEach(({ flag, callback }) => {
        featureFlagManager.removeListener(flag, callback);
      });
    };
  }, [featureFlags]);

  return enabledFlags;
};

// Convenience methods
export const isFeatureEnabled = (featureFlag) => featureFlagManager.isEnabled(featureFlag);
export const areFeaturesEnabled = (featureFlags) => featureFlagManager.areEnabled(featureFlags);
export const areAnyFeaturesEnabled = (featureFlags) => featureFlagManager.areAnyEnabled(featureFlags);
export const getEnabledFeatures = () => featureFlagManager.getEnabledFeatures();
export const getDisabledFeatures = () => featureFlagManager.getDisabledFeatures();
export const overrideFeature = (featureFlag, value) => featureFlagManager.overrideFeature(featureFlag, value);
export const clearFeatureOverride = (featureFlag) => featureFlagManager.clearOverride(featureFlag);

export default featureFlagManager;
