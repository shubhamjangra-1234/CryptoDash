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
    id: 'coins',
    label: 'Coins',
    href: '/coins',
    icon: 'Coins',
    description: 'Browse cryptocurrencies'
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    href: '/portfolio',
    icon: 'Portfolio',
    description: 'Manage your portfolio'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
    description: 'Application settings'
  }
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
