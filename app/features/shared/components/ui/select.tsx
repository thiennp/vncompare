import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '../../services/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            'flex h-11 w-full rounded-xl border border-[#9C88FF] bg-white px-4 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C88FF]/25 focus-visible:ring-offset-2 focus-visible:border-[#9C88FF] hover:border-[#9C88FF]/80 disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C88FF] pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
