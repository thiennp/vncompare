import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '../../services/utils';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="checkbox"
          className={cn(
            'peer h-4 w-4 shrink-0 rounded-sm border border-[#9C88FF] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C88FF]/25 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#9C88FF] data-[state=checked]:text-white',
            className
          )}
          ref={ref}
          {...props}
        />
        <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
