/**
 * Performance Monitoring System for CryptoDash
 * Tracks web vitals and custom performance metrics
 */

import { useRef, useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { logInfo, logWarn, logError } from './logger';
import { isFeatureEnabled } from './featureFlags';

// Performance metrics storage
class PerformanceMetrics {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.config = {
      enableWebVitals: true,
      enableCustomMetrics: true,
      enableResourceTiming: true,
      enableUserTiming: true,
      enableNavigationTiming: true,
      sampleRate: 1.0, // 100% sampling
      maxMetrics: 1000
    };
  }

  // Store a metric
  storeMetric(name, value, metadata = {}) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      url: typeof window !== 'undefined' ? window.location.href : null,
      ...metadata
    };

    this.metrics.set(name, metric);

    // Keep only the most recent metrics
    if (this.metrics.size > this.config.maxMetrics) {
      const oldestKey = this.metrics.keys().next().value;
      this.metrics.delete(oldestKey);
    }

    // Log metric based on value thresholds
    this.logMetricIfNeeded(metric);
  }

  // Log metric if it needs attention
  logMetricIfNeeded(metric) {
    const thresholds = this.getThresholds(metric.name);
    
    if (thresholds && metric.value > thresholds.warning) {
      if (metric.value > thresholds.critical) {
        logError(`Performance Critical: ${metric.name}`, metric);
      } else {
        logWarn(`Performance Warning: ${metric.name}`, metric);
      }
    } else {
      logInfo(`Performance Metric: ${metric.name}`, metric);
    }
  }

  // Get performance thresholds
  getThresholds(metricName) {
    const thresholds = {
      'LCP': { warning: 2500, critical: 4000 },
      'FID': { warning: 100, critical: 300 },
      'CLS': { warning: 0.1, critical: 0.25 },
      'FCP': { warning: 1800, critical: 3000 },
      'TTFB': { warning: 800, critical: 1800 },
      'INP': { warning: 200, critical: 500 }
    };
    
    return thresholds[metricName];
  }

  // Get metric value
  getMetric(name) {
    return this.metrics.get(name);
  }

  // Get all metrics
  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics() {
    this.metrics.clear();
  }

  // Export metrics
  exportMetrics() {
    const metrics = this.getAllMetrics();
    const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Web Vitals monitoring
class WebVitalsMonitor {
  constructor(metrics) {
    this.metrics = metrics;
    this.enabled = isFeatureEnabled('PERFORMANCE_MONITORING');
  }

  start() {
    if (!this.enabled) return;

    try {
      // Core Web Vitals
      getCLS((metric) => this.handleWebVital('CLS', metric));
      getFID((metric) => this.handleWebVital('FID', metric));
      getFCP((metric) => this.handleWebVital('FCP', metric));
      getLCP((metric) => this.handleWebVital('LCP', metric));
      getTTFB((metric) => this.handleWebVital('TTFB', metric));
      
      // Interaction to Next Paint (INP) - experimental
      if (typeof getINP === 'function') {
        getINP((metric) => this.handleWebVital('INP', metric));
      }
    } catch (error) {
      logError('Failed to start Web Vitals monitoring', null, error);
    }
  }

  handleWebVital(name, metric) {
    this.metrics.storeMetric(name, metric.value, {
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType
    });
  }
}

// Custom performance monitoring
class CustomPerformanceMonitor {
  constructor(metrics) {
    this.metrics = metrics;
    this.enabled = isFeatureEnabled('PERFORMANCE_MONITORING');
  }

  start() {
    if (!this.enabled) return;

    this.observeNavigationTiming();
    this.observeResourceTiming();
    this.observeUserTiming();
    this.observeLongTasks();
    this.observeMemoryUsage();
  }

  observeNavigationTiming() {
    if (!('performance' in window) || !('getEntriesByType' in performance)) return;

    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const nav = navigationEntries[0];
      
      this.metrics.storeMetric('domContentLoaded', nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart);
      this.metrics.storeMetric('loadComplete', nav.loadEventEnd - nav.loadEventStart);
      this.metrics.storeMetric('domInteractive', nav.domInteractive - nav.navigationStart);
      this.metrics.storeMetric('firstPaint', nav.responseStart - nav.requestStart);
    }
  }

  observeResourceTiming() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.metrics.storeMetric(`resource-${entry.name}`, entry.duration, {
              type: entry.initiatorType,
              size: entry.transferSize,
              encodedSize: entry.encodedBodySize
            });
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
      this.metrics.observers.set('resource', observer);
    } catch (error) {
      logWarn('Resource timing observation not supported', null, error);
    }
  }

  observeUserTiming() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.metrics.storeMetric(`measure-${entry.name}`, entry.duration);
          }
        });
      });

      observer.observe({ entryTypes: ['measure'] });
      this.metrics.observers.set('measure', observer);
    } catch (error) {
      logWarn('User timing observation not supported', null, error);
    }
  }

  observeLongTasks() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'longtask') {
            this.metrics.storeMetric('longTask', entry.duration, {
              startTime: entry.startTime,
              attribution: entry.attribution
            });
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
      this.metrics.observers.set('longtask', observer);
    } catch (error) {
      logWarn('Long task observation not supported', null, error);
    }
  }

  observeMemoryUsage() {
    if (!('performance' in window) || !('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      
      this.metrics.storeMetric('memoryUsed', memory.usedJSHeapSize);
      this.metrics.storeMetric('memoryTotal', memory.totalJSHeapSize);
      this.metrics.storeMetric('memoryLimit', memory.jsHeapSizeLimit);
      this.metrics.storeMetric('memoryUsage', (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
    };

    // Check memory every 5 seconds
    const interval = setInterval(checkMemory, 5000);
    
    // Store interval for cleanup
    this.metrics.observers.set('memory', { interval });
  }
}

// React performance monitoring
class ReactPerformanceMonitor {
  constructor(metrics) {
    this.metrics = metrics;
    this.enabled = isFeatureEnabled('PERFORMANCE_MONITORING');
    this.renderTimes = new Map();
  }

  // Track component render time
  trackRender(componentName, renderTime) {
    if (!this.enabled) return;

    this.metrics.storeMetric(`render-${componentName}`, renderTime, {
      component: componentName
    });

    // Track average render time
    const times = this.renderTimes.get(componentName) || [];
    times.push(renderTime);
    
    // Keep only last 10 render times
    if (times.length > 10) {
      times.shift();
    }
    
    this.renderTimes.set(componentName, times);
    
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    this.metrics.storeMetric(`render-avg-${componentName}`, average);
  }

  // Track re-render frequency
  trackRerender(componentName) {
    if (!this.enabled) return;

    const key = `rerender-${componentName}`;
    const current = this.metrics.getMetric(key);
    const count = current ? current.value + 1 : 1;
    
    this.metrics.storeMetric(key, count, {
      component: componentName
    });
  }
}

// Main performance monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = new PerformanceMetrics();
    this.webVitals = new WebVitalsMonitor(this.metrics);
    this.customMonitor = new CustomPerformanceMonitor(this.metrics);
    this.reactMonitor = new ReactPerformanceMonitor(this.metrics);
    this.isMonitoring = false;
  }

  start() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    
    // Start all monitoring modules
    this.webVitals.start();
    this.customMonitor.start();
    
    logInfo('Performance monitoring started');
  }

  stop() {
    if (!this.isMonitoring) return;

    // Stop all observers
    this.metrics.observers.forEach((observer, key) => {
      if (observer.disconnect) {
        observer.disconnect();
      } else if (observer.interval) {
        clearInterval(observer.interval);
      }
    });

    this.metrics.observers.clear();
    this.isMonitoring = false;
    
    logInfo('Performance monitoring stopped');
  }

  // Get performance summary
  getSummary() {
    const allMetrics = this.metrics.getAllMetrics();
    const summary = {
      timestamp: Date.now(),
      metrics: {},
      issues: []
    };

    // Categorize metrics
    Object.entries(allMetrics).forEach(([name, metric]) => {
      const category = this.categorizeMetric(name);
      if (!summary.metrics[category]) {
        summary.metrics[category] = {};
      }
      summary.metrics[category][name] = metric;
    });

    // Identify performance issues
    summary.issues = this.identifyIssues(allMetrics);

    return summary;
  }

  categorizeMetric(name) {
    if (['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'].includes(name)) {
      return 'webVitals';
    } else if (name.startsWith('render-')) {
      return 'react';
    } else if (name.startsWith('resource-')) {
      return 'resources';
    } else if (name.startsWith('memory')) {
      return 'memory';
    } else {
      return 'custom';
    }
  }

  identifyIssues(metrics) {
    const issues = [];

    Object.entries(metrics).forEach(([name, metric]) => {
      const thresholds = this.metrics.getThresholds(name);
      
      if (thresholds && metric.value > thresholds.critical) {
        issues.push({
          type: 'critical',
          metric: name,
          value: metric.value,
          threshold: thresholds.critical
        });
      } else if (thresholds && metric.value > thresholds.warning) {
        issues.push({
          type: 'warning',
          metric: name,
          value: metric.value,
          threshold: thresholds.warning
        });
      }
    });

    return issues;
  }

  // Export performance report
  exportReport() {
    const summary = this.getSummary();
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Auto-start in production
if (getEnvironment() === 'production' && isFeatureEnabled('PERFORMANCE_MONITORING')) {
  performanceMonitor.start();
}

// Development helper
if (typeof window !== 'undefined' && getEnvironment() === 'development') {
  window.performanceMonitor = performanceMonitor;
}

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const renderStartTime = useRef(performance.now());

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    performanceMonitor.reactMonitor.trackRender(componentName, renderTime);
  });

  useEffect(() => {
    // Track re-renders
    performanceMonitor.reactMonitor.trackRerender(componentName);
  });
};

// Convenience functions
export const startPerformanceMonitoring = () => performanceMonitor.start();
export const stopPerformanceMonitoring = () => performanceMonitor.stop();
export const getPerformanceMetrics = () => performanceMonitor.metrics.getAllMetrics();
export const getPerformanceSummary = () => performanceMonitor.getSummary();
export const exportPerformanceReport = () => performanceMonitor.exportReport();

export default performanceMonitor;
