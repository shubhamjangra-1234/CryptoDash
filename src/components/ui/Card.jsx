import React from 'react';

const Card = ({ 
  children, 
  className = "", 
  padding = 'md',
  shadow = 'lg',
  border = true,
  hover = false 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  const baseClasses = `
    bg-card 
    rounded-2xl 
    ${paddingClasses[padding]} 
    ${shadowClasses[shadow]}
    ${border ? 'border border-border' : ''}
    ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''}
    ${className}
  `.trim();

  return <div className={baseClasses}>{children}</div>;
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`mt-4 pt-4 border-t border-border ${className}`}>{children}</div>
);

export default Card;
