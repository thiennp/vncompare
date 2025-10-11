import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variantClasses = {
      default:
        'bg-gradient-to-r from-paint-orange to-paint-pink text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-xl',
      outline:
        'border border-paint-orange/30 bg-white text-paint-orange shadow-sm hover:bg-paint-orange/5 hover:border-paint-orange hover:scale-105 rounded-xl',
      secondary:
        'bg-gradient-to-r from-paint-teal to-paint-cyan text-white shadow-sm hover:shadow-md hover:scale-105 rounded-xl',
    };

    const sizeClasses = {
      default: 'h-10 px-6 py-2',
      sm: 'h-8 px-4 text-xs rounded-lg',
      lg: 'h-12 px-8 text-base rounded-2xl',
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
