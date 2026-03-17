/**
 * WebSocket Integration for CryptoDash
 * Provides real-time data streaming with reconnection and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { logInfo, logWarn, logError } from './logger';
import { isFeatureEnabled } from './featureFlags';

// WebSocket connection states
export const WS_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

// WebSocket message types
export const WS_MESSAGE_TYPES = {
  PRICE_UPDATE: 'price_update',
  MARKET_UPDATE: 'market_update',
  NEWS_UPDATE: 'news_update',
  PING: 'ping',
  PONG: 'pong',
  ERROR: 'error',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe'
};

// WebSocket manager class
class WebSocketManager {
  constructor() {
    this.connections = new Map();
    this.reconnectAttempts = new Map();
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.reconnectBackoff = 2;
    this.heartbeatInterval = 30000; // 30 seconds
    this.heartbeatTimeout = 5000; // 5 seconds
    this.heartbeatTimers = new Map();
    this.messageQueue = new Map();
    this.subscribers = new Map();
  }

  // Create or get WebSocket connection
  getConnection(url, options = {}) {
    const {
      autoReconnect = true,
      enableHeartbeat = true,
      messageQueueSize = 100
    } = options;

    if (this.connections.has(url)) {
      return this.connections.get(url);
    }

    const ws = new WebSocket(url);
    const connection = {
      ws,
      url,
      options,
      state: WS_STATES.CONNECTING,
      lastMessage: null,
      messageCount: 0,
      errorCount: 0,
      reconnectAttempts: 0
    };

    this.connections.set(url, connection);
    this.messageQueue.set(url, []);

    // Setup event handlers
    this.setupEventHandlers(connection);

    // Start heartbeat if enabled
    if (enableHeartbeat) {
      this.startHeartbeat(connection);
    }

    logInfo(`WebSocket connecting to: ${url}`);
    return connection;
  }

  // Setup WebSocket event handlers
  setupEventHandlers(connection) {
    const { ws, url } = connection;

    ws.onopen = (event) => {
      connection.state = WS_STATES.OPEN;
      connection.reconnectAttempts = 0;
      logInfo(`WebSocket connected to: ${url}`);

      // Send queued messages
      this.flushMessageQueue(connection);

      // Notify subscribers
      this.notifySubscribers(url, 'open', event);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        connection.lastMessage = message;
        connection.messageCount++;

        // Handle different message types
        this.handleMessage(connection, message);

        // Notify subscribers
        this.notifySubscribers(url, 'message', message);

        logInfo(`WebSocket message received from: ${url}`, message);
      } catch (error) {
        logError(`Failed to parse WebSocket message from: ${url}`, null, error);
      }
    };

    ws.onerror = (error) => {
      connection.errorCount++;
      connection.state = WS_STATES.CLOSED;
      logError(`WebSocket error from: ${url}`, null, error);

      // Notify subscribers
      this.notifySubscribers(url, 'error', error);

      // Attempt reconnection if enabled
      if (connection.options.autoReconnect) {
        this.attemptReconnection(connection);
      }
    };

    ws.onclose = (event) => {
      connection.state = WS_STATES.CLOSED;
      logInfo(`WebSocket closed from: ${url}`, { code: event.code, reason: event.reason });

      // Clear heartbeat
      this.stopHeartbeat(connection);

      // Notify subscribers
      this.notifySubscribers(url, 'close', event);

      // Attempt reconnection if enabled and not a normal closure
      if (connection.options.autoReconnect && event.code !== 1000) {
        this.attemptReconnection(connection);
      }
    };
  }

  // Handle different message types
  handleMessage(connection, message) {
    const { type, data } = message;

    switch (type) {
      case WS_MESSAGE_TYPES.PING:
        this.sendPong(connection);
        break;
      
      case WS_MESSAGE_TYPES.PONG:
        // Reset heartbeat timer
        this.resetHeartbeatTimer(connection);
        break;
      
      case WS_MESSAGE_TYPES.PRICE_UPDATE:
        this.handlePriceUpdate(connection, data);
        break;
      
      case WS_MESSAGE_TYPES.MARKET_UPDATE:
        this.handleMarketUpdate(connection, data);
        break;
      
      case WS_MESSAGE_TYPES.NEWS_UPDATE:
        this.handleNewsUpdate(connection, data);
        break;
      
      case WS_MESSAGE_TYPES.ERROR:
        logError(`WebSocket error message from: ${connection.url}`, data);
        break;
      
      default:
        logInfo(`Unknown WebSocket message type: ${type}`, message);
    }
  }

  // Handle price updates
  handlePriceUpdate(connection, data) {
    // Store latest price data
    if (!connection.priceData) {
      connection.priceData = new Map();
    }
    
    connection.priceData.set(data.symbol, {
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      timestamp: data.timestamp,
      volume: data.volume
    });

    // Notify price subscribers
    this.notifySubscribers(connection.url, 'priceUpdate', data);
  }

  // Handle market updates
  handleMarketUpdate(connection, data) {
    // Store latest market data
    if (!connection.marketData) {
      connection.marketData = new Map();
    }
    
    connection.marketData.set(data.symbol, {
      ...data,
      timestamp: Date.now()
    });

    // Notify market subscribers
    this.notifySubscribers(connection.url, 'marketUpdate', data);
  }

  // Handle news updates
  handleNewsUpdate(connection, data) {
    // Store latest news
    if (!connection.newsData) {
      connection.newsData = [];
    }
    
    connection.newsData.unshift(data);
    
    // Keep only last 50 news items
    if (connection.newsData.length > 50) {
      connection.newsData = connection.newsData.slice(0, 50);
    }

    // Notify news subscribers
    this.notifySubscribers(connection.url, 'newsUpdate', data);
  }

  // Send message with queue support
  sendMessage(connection, message) {
    const { ws, url } = connection;

    if (connection.state !== WS_STATES.OPEN) {
      // Queue message if not connected
      const queue = this.messageQueue.get(url);
      if (queue.length < 100) {
        queue.push(message);
      }
      return false;
    }

    try {
      const messageString = JSON.stringify(message);
      ws.send(messageString);
      logInfo(`WebSocket message sent to: ${url}`, message);
      return true;
    } catch (error) {
      logError(`Failed to send WebSocket message to: ${url}`, null, error);
      return false;
    }
  }

  // Flush message queue
  flushMessageQueue(connection) {
    const queue = this.messageQueue.get(connection.url);
    
    while (queue.length > 0) {
      const message = queue.shift();
      this.sendMessage(connection, message);
    }
  }

  // Subscribe to data
  subscribe(connection, symbols, types = [WS_MESSAGE_TYPES.PRICE_UPDATE]) {
    const message = {
      type: WS_MESSAGE_TYPES.SUBSCRIBE,
      data: {
        symbols: Array.isArray(symbols) ? symbols : [symbols],
        types
      }
    };

    return this.sendMessage(connection, message);
  }

  // Unsubscribe from data
  unsubscribe(connection, symbols, types = [WS_MESSAGE_TYPES.PRICE_UPDATE]) {
    const message = {
      type: WS_MESSAGE_TYPES.UNSUBSCRIBE,
      data: {
        symbols: Array.isArray(symbols) ? symbols : [symbols],
        types
      }
    };

    return this.sendMessage(connection, message);
  }

  // Add event subscriber
  addSubscriber(url, eventType, callback) {
    if (!this.subscribers.has(url)) {
      this.subscribers.set(url, new Map());
    }

    const urlSubscribers = this.subscribers.get(url);
    
    if (!urlSubscribers.has(eventType)) {
      urlSubscribers.set(eventType, []);
    }

    urlSubscribers.get(eventType).push(callback);
  }

  // Remove event subscriber
  removeSubscriber(url, eventType, callback) {
    const urlSubscribers = this.subscribers.get(url);
    
    if (urlSubscribers && urlSubscribers.has(eventType)) {
      const callbacks = urlSubscribers.get(eventType);
      const index = callbacks.indexOf(callback);
      
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify subscribers
  notifySubscribers(url, eventType, data) {
    const urlSubscribers = this.subscribers.get(url);
    
    if (urlSubscribers && urlSubscribers.has(eventType)) {
      urlSubscribers.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          logError(`WebSocket subscriber error`, null, error);
        }
      });
    }
  }

  // Heartbeat management
  startHeartbeat(connection) {
    const { url } = connection;
    
    const heartbeatTimer = setInterval(() => {
      if (connection.state === WS_STATES.OPEN) {
        this.sendPing(connection);
        
        // Set timeout for pong response
        connection.pongTimeout = setTimeout(() => {
          logWarn(`WebSocket heartbeat timeout for: ${url}`);
          connection.ws.close();
        }, this.heartbeatTimeout);
      }
    }, this.heartbeatInterval);

    this.heartbeatTimers.set(url, heartbeatTimer);
  }

  stopHeartbeat(connection) {
    const { url } = connection;
    
    if (this.heartbeatTimers.has(url)) {
      clearInterval(this.heartbeatTimers.get(url));
      this.heartbeatTimers.delete(url);
    }

    if (connection.pongTimeout) {
      clearTimeout(connection.pongTimeout);
      connection.pongTimeout = null;
    }
  }

  resetHeartbeatTimer(connection) {
    if (connection.pongTimeout) {
      clearTimeout(connection.pongTimeout);
      connection.pongTimeout = null;
    }
  }

  sendPing(connection) {
    const message = {
      type: WS_MESSAGE_TYPES.PING,
      timestamp: Date.now()
    };

    this.sendMessage(connection, message);
  }

  sendPong(connection) {
    const message = {
      type: WS_MESSAGE_TYPES.PONG,
      timestamp: Date.now()
    };

    this.sendMessage(connection, message);
  }

  // Reconnection logic
  attemptReconnection(connection) {
    const { url } = connection;
    
    if (connection.reconnectAttempts >= this.maxReconnectAttempts) {
      logError(`Max reconnection attempts reached for: ${url}`);
      return;
    }

    connection.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(this.reconnectBackoff, connection.reconnectAttempts - 1);

    logInfo(`Attempting WebSocket reconnection to: ${url} (attempt ${connection.reconnectAttempts})`);

    setTimeout(() => {
      const newConnection = this.getConnection(url, connection.options);
      this.connections.set(url, newConnection);
    }, delay);
  }

  // Close connection
  closeConnection(url) {
    const connection = this.connections.get(url);
    
    if (connection) {
      this.stopHeartbeat(connection);
      connection.ws.close();
      this.connections.delete(url);
      this.messageQueue.delete(url);
      this.subscribers.delete(url);
      this.heartbeatTimers.delete(url);
    }
  }

  // Get connection statistics
  getConnectionStats(url) {
    const connection = this.connections.get(url);
    
    if (!connection) {
      return null;
    }

    return {
      url,
      state: connection.state,
      messageCount: connection.messageCount,
      errorCount: connection.errorCount,
      reconnectAttempts: connection.reconnectAttempts,
      lastMessage: connection.lastMessage,
      uptime: Date.now() - (connection.connectTime || Date.now())
    };
  }

  // Get all connections statistics
  getAllStats() {
    const stats = {};
    
    this.connections.forEach((connection, url) => {
      stats[url] = this.getConnectionStats(url);
    });

    return stats;
  }
}

// Create singleton instance
const wsManager = new WebSocketManager();

// React hook for WebSocket
export const useWebSocket = (url, options = {}) => {
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url || !isFeatureEnabled('WEBSOCKET_UPDATES')) {
      return;
    }

    const wsConnection = wsManager.getConnection(url, {
      ...options,
      autoReconnect: true,
      enableHeartbeat: true
    });
    setConnection(wsConnection);

    // Subscribe to events
    const handleOpen = () => {
      setIsConnected(true);
      setError(null);
    };

    const handleClose = () => {
      setIsConnected(false);
    };

    const handleError = (err) => {
      setError(err);
    };

    const handleMessage = (message) => {
      setLastMessage(message);
    };

    wsManager.addSubscriber(url, 'open', handleOpen);
    wsManager.addSubscriber(url, 'close', handleClose);
    wsManager.addSubscriber(url, 'error', handleError);
    wsManager.addSubscriber(url, 'message', handleMessage);

    // Cleanup
    return () => {
      wsManager.removeSubscriber(url, 'open', handleOpen);
      wsManager.removeSubscriber(url, 'close', handleClose);
      wsManager.removeSubscriber(url, 'error', handleError);
      wsManager.removeSubscriber(url, 'message', handleMessage);
      wsManager.closeConnection(url);
    };
  }, [url, options]);

  const sendMessage = useCallback((message) => {
    if (connection) {
      return wsManager.sendMessage(connection, message); 
    }
    return false;
  }, [connection]);

  const subscribe = useCallback((symbols, types) => {
    if (connection) {
      return wsManager.subscribe(connection, symbols, types);
    }
    return false;
  }, [connection]);

  const unsubscribe = useCallback((symbols, types) => {
    if (connection) {
      return wsManager.unsubscribe(connection, symbols, types);
    }
    return false;
  }, [connection]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    subscribe,
    unsubscribe,
    connection
  };
};

// Crypto-specific WebSocket hooks
export const useCryptoPriceUpdates = (symbols) => {
  const [prices, setPrices] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);

  const wsUrl = import.meta.env.VITE_CRYPTO_WS_URL || 'wss://api.coincap.io/ws2';
  const { isConnected, subscribe, unsubscribe } = useWebSocket(wsUrl);

  useEffect(() => {
    if (isConnected && symbols && symbols.length > 0) {
      subscribe(symbols, [WS_MESSAGE_TYPES.PRICE_UPDATE]);
    }

    return () => {
      if (symbols && symbols.length > 0) {
        unsubscribe(symbols, [WS_MESSAGE_TYPES.PRICE_UPDATE]);
      }
    };
  }, [isConnected, symbols, subscribe, unsubscribe]);

  // Handle price updates
  const handlePriceUpdate = useCallback((data) => {
    setPrices(prev => ({
      ...prev,
      [data.symbol]: data
    }));
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    if (isConnected) {
      wsManager.addSubscriber(wsUrl, 'priceUpdate', handlePriceUpdate);
    }

    return () => {
      wsManager.removeSubscriber(wsUrl, 'priceUpdate', handlePriceUpdate);
    };
  }, [isConnected, wsUrl, handlePriceUpdate]);

  return { prices, lastUpdate, isConnected };
};

export default wsManager;
