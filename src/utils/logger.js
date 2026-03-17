/**
 * Production-level logging system for CryptoDash
 * Provides structured logging with different levels and environments
 */

// Log levels with priority
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

// Environment-based configuration
const ENV_CONFIG = {
  development: {
    level: LOG_LEVELS.TRACE,
    enableConsole: true,
    enableRemote: false,
    enableStorage: true,
    maxStorageSize: 1000
  },
  production: {
    level: LOG_LEVELS.WARN,
    enableConsole: false,
    enableRemote: true,
    enableStorage: false,
    maxStorageSize: 500
  },
  test: {
    level: LOG_LEVELS.ERROR,
    enableConsole: false,
    enableRemote: false,
    enableStorage: false,
    maxStorageSize: 0
  }
};

// Get current environment
const getEnvironment = () => {
  return import.meta.env?.MODE || 'development';
};

// Get config for current environment
const getConfig = () => {
  const env = getEnvironment();
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};

// Local storage for logs
class LogStorage {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.storageKey = 'cryptodash_logs';
  }

  store(logEntry) {
    try {
      const logs = this.getLogs();
      logs.push(logEntry);
      
      // Keep only the most recent logs
      if (logs.length > this.maxSize) {
        logs.splice(0, logs.length - this.maxSize);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      // Silent fail for storage errors
    }
  }

  getLogs() {
    try {
      const logs = localStorage.getItem(this.storageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      return [];
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      // Silent fail for storage errors
    }
  }

  getLogsByLevel(level) {
    return this.getLogs().filter(log => log.level === level);
  }

  getRecentLogs(count = 50) {
    const logs = this.getLogs();
    return logs.slice(-count);
  }
}

// Remote logging service (mock implementation)
class RemoteLogger {
  constructor() {
    this.endpoint = import.meta.env.VITE_LOG_ENDPOINT || null;
    this.apiKey = import.meta.env.VITE_LOG_API_KEY || null;
    this.buffer = [];
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 seconds
    
    this.setupBatchFlush();
  }

  setupBatchFlush() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  async send(logEntry) {
    if (!this.endpoint || !this.apiKey) {
      return false;
    }

    try {
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Failed to send log to remote service:', error);
      return false;
    }
  }

  add(logEntry) {
    this.buffer.push(logEntry);
    
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0) {
      return;
    }

    const logsToSend = this.buffer.splice(0, this.batchSize);
    
    try {
      // Send logs in batch
      await Promise.all(logsToSend.map(log => this.send(log)));
    } catch (error) {
      // Add logs back to buffer if send failed
      this.buffer.unshift(...logsToSend);
    }
  }
}

// Main logger class
class Logger {
  constructor() {
    this.config = getConfig();
    this.storage = new LogStorage(this.config.maxStorageSize);
    this.remoteLogger = new RemoteLogger();
    this.context = {};
  }

  setContext(context) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  createLogEntry(level, message, data = null, error = null) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null,
      context: { ...this.context },
      environment: getEnvironment(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      url: typeof window !== 'undefined' ? window.location.href : null
    };
  }

  shouldLog(level) {
    return level <= this.config.level;
  }

  formatMessage(logEntry) {
    const { timestamp, level, message, context, error } = logEntry;
    
    let formatted = `[${timestamp}] [${level}] ${message}`;
    
    if (Object.keys(context).length > 0) {
      formatted += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      formatted += ` | Error: ${error.message}`;
    }
    
    return formatted;
  }

  log(level, message, data = null, error = null) {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = this.createLogEntry(level, message, data, error);

    // Console logging
    if (this.config.enableConsole) {
      const formattedMessage = this.formatMessage(logEntry);
      
      switch (level) {
        case LOG_LEVELS.ERROR:
          console.error(formattedMessage, logEntry);
          break;
        case LOG_LEVELS.WARN:
          console.warn(formattedMessage, logEntry);
          break;
        case LOG_LEVELS.INFO:
          console.info(formattedMessage, logEntry);
          break;
        case LOG_LEVELS.DEBUG:
          console.debug(formattedMessage, logEntry);
          break;
        case LOG_LEVELS.TRACE:
          console.trace(formattedMessage, logEntry);
          break;
      }
    }

    // Local storage
    if (this.config.enableStorage) {
      this.storage.store(logEntry);
    }

    // Remote logging
    if (this.config.enableRemote) {
      this.remoteLogger.add(logEntry);
    }
  }

  error(message, data = null, error = null) {
    this.log(LOG_LEVELS.ERROR, message, data, error);
  }

  warn(message, data = null) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data = null) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data = null) {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }

  trace(message, data = null) {
    this.log(LOG_LEVELS.TRACE, message, data);
  }

  // Performance logging
  startTimer(label) {
    const startTime = performance.now();
    return {
      end: (data = null) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.info(`Timer: ${label}`, {
          duration: `${duration.toFixed(2)}ms`,
          ...data
        });
        return duration;
      }
    };
  }

  // User action logging
  logUserAction(action, details = null) {
    this.info(`User Action: ${action}`, {
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // API logging
  logApiCall(method, url, duration, status, error = null) {
    const logData = {
      method,
      url,
      duration: `${duration.toFixed(2)}ms`,
      status
    };

    if (error) {
      this.error(`API Error: ${method} ${url}`, logData, error);
    } else if (status >= 400) {
      this.warn(`API Warning: ${method} ${url}`, logData);
    } else {
      this.info(`API Success: ${method} ${url}`, logData);
    }
  }

  // Error boundary logging
  logErrorBoundary(error, errorInfo) {
    this.error('React Error Boundary Caught Error', {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    }, error);
  }

  // Get stored logs
  getStoredLogs() {
    return this.storage.getLogs();
  }

  getStoredLogsByLevel(level) {
    return this.storage.getLogsByLevel(level);
  }

  getRecentStoredLogs(count = 50) {
    return this.storage.getRecentLogs(count);
  }

  clearStoredLogs() {
    this.storage.clear();
  }

  // Export logs for debugging
  exportLogs() {
    const logs = this.getStoredLogs();
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cryptodash-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const logger = new Logger();

// Development helper - expose logger to window
if (typeof window !== 'undefined' && getEnvironment() === 'development') {
  window.logger = logger;
  window.LOG_LEVELS = LOG_LEVELS;
}

// Export convenience methods
export const logError = (message, data = null, error = null) => logger.error(message, data, error);
export const logWarn = (message, data = null) => logger.warn(message, data);
export const logInfo = (message, data = null) => logger.info(message, data);
export const logDebug = (message, data = null) => logger.debug(message, data);
export const logTrace = (message, data = null) => logger.trace(message, data);

// Export timer utility
export const startTimer = (label) => logger.startTimer(label);

// Export context utilities
export const setLogContext = (context) => logger.setContext(context);
export const clearLogContext = () => logger.clearContext();

// Export other utilities
export const logUserAction = (action, details = null) => logger.logUserAction(action, details);
export const logApiCall = (method, url, duration, status, error = null) => logger.logApiCall(method, url, duration, status, error);
export const logErrorBoundary = (error, errorInfo) => logger.logErrorBoundary(error, errorInfo);

export default logger;
