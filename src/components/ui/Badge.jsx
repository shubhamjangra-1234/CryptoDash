import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = "" 
}) => {
  const variantClasses = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    secondary: 'bg-muted/50 text-muted-foreground border-border'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseClasses = `
    inline-flex items-center gap-1.5
    border rounded-full
    font-medium
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return <span className={baseClasses}>{children}</span>;
};

export const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    active: { variant: 'success', text: 'Active' },
    inactive: { variant: 'error', text: 'Inactive' },
    pending: { variant: 'warning', text: 'Pending' },
    centralized: { variant: 'info', text: 'Centralized' },
    decentralized: { variant: 'success', text: 'Decentralized' }
  };

  const config = statusConfig[status] || { variant: 'secondary', text: status };

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.text}
    </Badge>
  );
};

export default Badge;
