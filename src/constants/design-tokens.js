// Design System Tokens - Modern Crypto/Fintech Theme
export const DESIGN_TOKENS = {
  colors: {
    primary: {
      light: '#0F172A',
      dark: '#111827'
    },
    secondary: {
      light: '#22C55E',
      dark: '#16A34A'
    },
    accent: {
      light: '#3B82F6',
      dark: '#2563EB'
    },
    background: {
      light: '#F8FAFC',
      dark: '#0B1120'
    },
    surface: {
      light: '#FFFFFF',
      dark: '#111827'
    },
    border: {
      light: '#E5E7EB',
      dark: '#1F2937'
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      muted: '#9CA3AF'
    }
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      h1: '1.875rem',
      h2: '1.5rem',
      h3: '1.25rem',
      body: '1rem',
      small: '0.875rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms'
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)'
    }
  }
};

// Component Variants
export const COMPONENT_VARIANTS = {
  button: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline'
    },
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10'
    }
  },
  
  card: {
    variant: {
      default: 'bg-card text-card-foreground border rounded-xl shadow-lg',
      elevated: 'bg-card text-card-foreground border rounded-xl shadow-xl',
      outlined: 'bg-card text-card-foreground border-2 rounded-xl',
      flat: 'bg-card text-card-foreground rounded-xl'
    }
  },
  
  input: {
    variant: {
      default: 'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      ghost: 'flex h-10 w-full rounded-lg border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
    }
  }
};

// Layout Patterns
export const LAYOUT_PATTERNS = {
  dashboard: {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    section: 'p-6 space-y-6',
    card: 'bg-card border rounded-xl shadow-lg p-6 space-y-4'
  },
  
  navigation: {
    sidebar: 'w-64 bg-card border-r border-border h-full',
    sidebarCollapsed: 'w-16 bg-card border-r border-border h-full',
    header: 'h-16 bg-background border-b border-border',
    main: 'flex-1 overflow-y-auto p-6'
  },
  
  data: {
    table: 'w-full border-separate border-spacing-0',
    tableHeader: 'border-b border-border px-4 py-3 text-left text-sm font-medium text-muted-foreground',
    tableCell: 'border-b border-border px-4 py-3 text-sm',
    chart: 'h-64 w-full bg-card rounded-xl p-4'
  }
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Utility Classes
export const UTILITIES = {
  transitions: {
    subtle: 'transition-all duration-200 ease-in-out',
    smooth: 'transition-all duration-300 ease-in-out',
    bounce: 'transition-all duration-150 ease-bounce'
  },
  
  hover: {
    lift: 'hover:shadow-lg hover:-translate-y-1',
    scale: 'hover:scale-105',
    glow: 'hover:shadow-lg hover:shadow-primary/20'
  },
  
    focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    ringAccent: 'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
    }
  }

