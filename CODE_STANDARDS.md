# CryptoDash - Code Standards & Best Practices

## 🎯 Purpose
This document outlines the coding standards, best practices, and conventions used in the CryptoDash project to ensure consistent, maintainable, and professional code quality.

## 📋 Table of Contents
1. [Code Formatting](#code-formatting)
2. [Naming Conventions](#naming-conventions)
3. [File Organization](#file-organization)
4. [Component Standards](#component-standards)
5. [API Integration](#api-integration)
6. [Error Handling](#error-handling)
7. [Performance](#performance)
8. [Security](#security)
9. [Testing](#testing)
10. [Documentation](#documentation)

## 🎨 Code Formatting

### ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Code Style Rules
- **Indentation**: 2 spaces (no tabs)
- **Line Endings**: LF (Unix style)
- **Max Line Length**: 100 characters
- **Semicolons**: Required at end of statements
- **Quotes**: Single quotes for strings

## 🏷️ Naming Conventions

### Files and Folders
```javascript
// ✅ Good
coinDetailService.js
userAuthentication.js
marketChartComponent.jsx

// ❌ Bad
CoinDetailService.js  // PascalCase for files
userAuth.js           // Abbreviations
MarketChart.jsx        // Inconsistent naming
```

### Variables and Functions
```javascript
// ✅ Good
const isLoadingData = false;
const getUserPortfolio = () => {};
const MAX_RETRY_ATTEMPTS = 3;

// ❌ Bad
const loading = false;
const getPortfolio = () => {};
const maxRetries = 3;
```

### Components
```javascript
// ✅ Good
const CoinDetailHeader = () => {};
const MarketChartSection = () => {};
const UserPortfolio = () => {};

// ❌ Bad
const coinDetailHeader = () => {};  // camelCase
const marketchart = () => {};         // lowercase
const userportfolio = () => {};       // all lowercase
```

### Constants
```javascript
// ✅ Good
const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const MAX_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CURRENCY = 'usd';

// ❌ Bad
const apiUrl = 'https://api.coingecko.com/api/v3';  // Not uppercase
const maxCacheDuration = 300000;  // Magic number
const currency = 'usd';              // Not descriptive
```

## 📁 File Organization

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/           # Base component library
│   └── common/        # Shared components
├── modules/             # Feature-based modules
│   ├── coin-detail/   # Single feature per folder
│   ├── categories/     # Related components together
│   └── crypto/         # API services
├── services/             # External API integration
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── styles/              # Global styles
```

### File Naming
- **Components**: PascalCase (e.g., `CoinDetailHeader.jsx`)
- **Services**: camelCase with "Service" suffix (e.g., `cryptoService.js`)
- **Hooks**: camelCase with "use" prefix (e.g., `useCoinData.js`)
- **Utilities**: camelCase (e.g., `formatCurrency.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### Import Order
```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import axios from 'axios';
import { TrendingUp } from 'lucide-react';

// 3. Local imports
import { formatCurrency } from '../utils/formatters';
import { cryptoService } from '../services/cryptoService';

// 4. Types (if using TypeScript)
import type { Coin, MarketData } from '../types';
```

## 🧩 Component Standards

### Component Structure
```javascript
// ✅ Good Component Structure
const CoinDetailHeader = ({ coin, loading, error }) => {
  // 1. Hooks at the top
  const [localState, setLocalState] = useState(null);
  
  // 2. Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 3. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 4. Conditional rendering
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  // 5. Main JSX
  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
};

export default CoinDetailHeader;
```

### Props Destructuring
```javascript
// ✅ Good
const CoinCard = ({ 
  coin, 
  onFavorite, 
  showDetails,
  currency = 'usd' 
}) => {
  // Component logic
};

// ❌ Bad
const CoinCard = (props) => {
  const { coin, onFavorite, showDetails, currency } = props;
  // Destructuring inside component body
};
```

### PropTypes (JavaScript)
```javascript
import PropTypes from 'prop-types';

const CoinDetailHeader = ({ coin, loading, error }) => {
  // Component logic
};

CoinDetailHeader.propTypes = {
  coin: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object
};

export default CoinDetailHeader;
```

## 🌐 API Integration

### Service Pattern
```javascript
// ✅ Good Service Structure
export const cryptoService = {
  // Clear method names
  getCoinDetails: async (id, currency = 'usd') => {
    try {
      const response = await api.get(`/coins/${id}`, {
        params: { currency }
      });
      return response.data;
    } catch (error) {
      // Consistent error handling
      throw new Error(`Failed to fetch coin details: ${error.message}`);
    }
  },
  
  // Default parameters
  searchCoins: async (query = '', limit = 10) => {
    // Implementation
  }
};
```

### Error Handling Standards
```javascript
// ✅ Good Error Handling
const fetchCoinData = async (id) => {
  try {
    const data = await cryptoService.getCoinDetails(id);
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    
    // Specific error types
    if (error.response?.status === 404) {
      return { success: false, error: 'Coin not found' };
    }
    
    if (error.response?.status === 429) {
      return { success: false, error: 'Rate limit exceeded' };
    }
    
    // Generic error handling
    return { success: false, error: error.message || 'Unknown error' };
  }
};
```

### Rate Limiting
```javascript
// ✅ Good Rate Limiting
const API_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

export const withRetry = async (apiCall, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      // Only retry on rate limit errors
      if (error.response?.status === 429 && i < retries - 1) {
        await delay(RETRY_DELAY);
        continue;
      }
      throw error;
    }
  }
};
```

## ⚡ Performance

### React Optimizations
```javascript
// ✅ Good Performance Practices

// 1. Memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// 2. Callback optimization
useEffect(() => {
  // Cleanup function
  return () => {
    clearInterval(interval);
    unsubscribe();
  };
}, [dependencies]);

// 3. Lazy loading
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// 4. Debouncing
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};
```

### Caching Strategy
```javascript
// ✅ Good Caching Implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const withCache = (key, apiCall) => {
  const cached = cache.get(key);
  const now = Date.now();
  
  // Return cached data if fresh
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  
  // Fetch fresh data and cache
  try {
    const result = await apiCall();
    cache.set(key, { data: result, timestamp: now });
    return result;
  } catch (error) {
    cache.delete(key); // Clear stale cache
    throw error;
  }
};
```

## 🔒 Security

### Input Validation
```javascript
// ✅ Good Input Validation
import DOMPurify from 'dompurify';

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous content
  const clean = DOMPurify.sanitize(input);
  
  // Length validation
  if (clean.length > 1000) {
    throw new Error('Input too long');
  }
  
  return clean.trim();
};
```

### Environment Variables
```javascript
// ✅ Good Environment Usage
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  key: import.meta.env.VITE_API_KEY
};

// ❌ Bad - Hardcoded values
const API_CONFIG = {
  baseURL: 'https://api.example.com',
  timeout: 10000,
  key: 'hardcoded-api-key'
};
```

## 🧪 Testing

### Unit Testing Structure
```javascript
// ✅ Good Test Structure
import { render, screen, fireEvent } from '@testing-library/react';
import CoinDetailHeader from '../CoinDetailHeader';

describe('CoinDetailHeader', () => {
  const mockCoin = {
    id: 'bitcoin',
    name: 'Bitcoin',
    price: 50000
  };

  test('renders coin name correctly', () => {
    render(<CoinDetailHeader coin={mockCoin} />);
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  test('handles loading state', () => {
    render(<CoinDetailHeader loading={true} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
});
```

### Test Coverage Goals
- **Statements**: 80%+ coverage
- **Branches**: 75%+ coverage  
- **Functions**: 85%+ coverage
- **Lines**: 80%+ coverage

## 📚 Documentation

### JSDoc Standards
```javascript
/**
 * Fetches cryptocurrency data from the API
 * @param {string} id - The cryptocurrency ID
 * @param {string} currency - The target currency (default: 'usd')
 * @returns {Promise<Object>} The cryptocurrency data
 * @throws {Error} When API request fails
 * @example
 * const data = await cryptoService.getCoinDetails('bitcoin', 'eur');
 */
const getCoinDetails = async (id, currency = 'usd') => {
  // Implementation
};
```

### Comment Standards
```javascript
// ✅ Good Comments
// Calculate the percentage change from previous value
// This handles both positive and negative changes
const calculateChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

// ❌ Bad Comments
// calc change
// do math
const x = () => {
  return y * 2;
};
```

## 🚀 Git Standards

### Commit Message Format
```
type(scope): description

Examples:
feat(components): add new coin detail header component
fix(api): resolve rate limiting issue
docs(readme): update installation instructions
refactor(utils): optimize currency formatting functions
test(chart): add unit tests for market chart
chore(deps): update axios to latest version
```

### Branch Strategy
- **main**: Stable production code
- **develop**: Active development
- **feature/***: New features in isolation
- **hotfix/***: Critical bug fixes

## 📏 Code Review Checklist

### Before Commit
- [ ] Code follows naming conventions
- [ ] Components are properly structured
- [ ] Error handling is comprehensive
- [ ] Performance optimizations implemented
- [ ] Security measures in place
- [ ] Tests are passing
- [ ] Documentation is updated

### Code Quality Gates
- **No ESLint errors**
- **No Prettier warnings**
- **All tests passing**
- **Bundle size under limits**
- **Lighthouse score 90+**

---

## 💡 Senior Development Practices

This project demonstrates:
1. **Enterprise-level code organization**
2. **Comprehensive error handling strategy**
3. **Performance optimization techniques**
4. **Security best practices**
5. **Professional documentation standards**
6. **Modern React patterns and hooks**
7. **API integration with rate limiting**
8. **Testing methodology and coverage**
9. **Git workflow and version control**

Following these standards ensures maintainable, scalable, and professional code quality.
