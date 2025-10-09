import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../services/utils';

const BUTTON_VARIANTS = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-paint-orange to-paint-pink text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-xl',
        destructive:
          'bg-gradient-to-r from-paint-red to-paint-coral text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-xl',
        outline:
          'border border-paint-orange/30 bg-white text-paint-orange shadow-sm hover:bg-paint-orange/5 hover:border-paint-orange hover:scale-105 rounded-xl',
        secondary:
          'bg-gradient-to-r from-paint-teal to-paint-cyan text-white shadow-sm hover:shadow-md hover:scale-105 rounded-xl',
        ghost:
          'text-paint-orange hover:bg-paint-orange/10 hover:text-paint-orange hover:scale-105 rounded-xl',
        link: 'text-paint-orange underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-xs rounded-lg',
        lg: 'h-12 px-8 text-base rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof BUTTON_VARIANTS> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(BUTTON_VARIANTS({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, BUTTON_VARIANTS, type ButtonProps };
