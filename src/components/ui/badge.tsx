import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-paint-orange to-paint-pink text-white shadow-sm hover:shadow-md',
        secondary:
          'border-transparent bg-gradient-to-r from-paint-teal to-paint-cyan text-white shadow-sm hover:shadow-md',
        destructive:
          'border-transparent bg-gradient-to-r from-paint-red to-paint-coral text-white shadow-sm hover:shadow-md',
        outline:
          'border-paint-orange/30 text-paint-orange bg-white hover:bg-paint-orange/5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }; // eslint-disable-line react-refresh/only-export-components
