// Navigation configuration for the entire application
export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: 'Dashboard',
    description: 'Overview and statistics'
  },
  {
    id: 'markets',
    label: 'Markets',
    href: '/markets',
    icon: 'Markets',
    description: 'Browse cryptocurrency markets'
  },
  {
    id: 'categories',
    label: 'Categories',
    href: '/categories',
    icon: 'Categories',
    description: 'Explore crypto categories'
  },
  {
    id: 'exchanges',
    label: 'Exchanges',
    href: '/exchanges',
    icon: 'Exchanges',
    description: 'Compare exchanges'
  },
];

export const HEADER_ACTIONS = [
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'Bell',
    action: 'notifications'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'User',
    action: 'profile'
  },
  {
    id: 'theme',
    label: 'Toggle Theme',
    icon: 'Moon',
    action: 'theme'
  }
];

export const LAYOUT_CONFIG = {
  sidebar: {
    width: 'w-64',
    collapsedWidth: 'w-16',
    collapsible: true
  },
  header: {
    height: 'h-16'
  },
  main: {
    padding: 'p-6'
  }
};
