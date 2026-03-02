import React from 'react';
import { cn } from '@/lib/utils';

// Logo Component - Pure UI, no business logic
export const Logo = ({ 
  size = 'md', 
  showText = true, 
  className = "",
  textClassName = "",
  imageClassName = ""
}) => {
  // Size configurations
  const sizes = {
    sm: {
      container: 'text-sm',
      image: 'w-10 h-10',
      text: 'text-sm font-semibold'
    },
    md: {
      container: 'text-lg',
      image: 'w-12 h-12',
      text: 'text-lg font-semibold'
    },
    lg: {
      container: 'text-xl',
      image: 'w-14 h-14',
      text: 'text-xl font-bold'
    },
    xl: {
      container: 'text-2xl',
      image: 'w-16 h-16',
      text: 'text-2xl font-bold'
    }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={cn(
      'flex items-center space-x-2 transition-all duration-200',
      currentSize.container,
      className
    )}>
      {/* Logo Image */}
      <img
        src="/Images/CryptoDash.png"
        alt="CryptoDash Logo"
        className={cn(
          'rounded-lg object-cover bg-transparent',
          currentSize.image,
          imageClassName
        )}
        onError={(e) => {
          // Fallback to a simple text logo if image fails to load
          e.target.style.display = 'none';
          const fallback = e.target.nextSibling;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      
      {/* Fallback Logo (hidden by default) */}
      <div 
        className="hidden items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg font-bold shadow-lg"
        style={{ display: 'none' }}
      >
        <span className={cn(
          'font-bold',
          size === 'sm' ? 'text-xs' : 
          size === 'md' ? 'text-sm' : 
          size === 'lg' ? 'text-base' : 'text-lg'
        )}>
          CD
        </span>
      </div>
       
      {/* Logo Text */}
      {showText && (
        <span className={cn(
          'text-zinc-200 font-bold transition-colors',
          currentSize.text,
          textClassName
        )}>
          CryptoDash
        </span>
      )}
    </div>
  );
};

// Logo Variants for different contexts
export const LogoSmall = (props) => <Logo size="sm" {...props} />;
export const LogoMedium = (props) => <Logo size="md" {...props} />;
export const LogoLarge = (props) => <Logo size="lg" {...props} />;
export const LogoExtraLarge = (props) => <Logo size="xl" {...props} />;

// Logo with no text (icon only)
export const LogoIcon = (props) => <Logo showText={false} size="md" {...props} />;

export default Logo;
