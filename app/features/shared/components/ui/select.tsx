import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '../../services/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <div
          className="absolute mt-2 pointer-events-none bg-white p-2 rounded-full"
          style={{ right: 1, top: -2 }}
        >
          <ChevronDown className="h-4 w-4 text-paint-orange" />
        </div>

        <select
          className={cn(
            'appearance-none flex h-11 w-full rounded-xl border border-paint-orange/30 bg-white px-4 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C88FF]/25 focus-visible:ring-offset-2 focus-visible:border-[#9C88FF] hover:border-[#9C88FF]/80 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
