import * as React from 'react';

interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, open, onOpenChange, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`fixed inset-0 z-50 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
);
Sheet.displayName = 'Sheet';

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, side = 'right', ...props }, ref) => {
    const sideClasses = {
      left: 'fixed inset-y-0 left-0 h-full w-3/4 border-r',
      right: 'fixed inset-y-0 right-0 h-full w-3/4 border-l',
      top: 'fixed inset-x-0 top-0 h-3/4 border-b',
      bottom: 'fixed inset-x-0 bottom-0 h-3/4 border-t',
    };

    return (
      <div
        ref={ref}
        className={`${sideClasses[side]} bg-background p-6 shadow-lg sm:max-w-sm ${className || ''}`}
        {...props}
      />
    );
  }
);
SheetContent.displayName = 'SheetContent';

interface SheetTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ className, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ref, ...props });
    }

    return (
      <button ref={ref} className={`${className || ''}`} {...props}>
        {children}
      </button>
    );
  }
);
SheetTrigger.displayName = 'SheetTrigger';

export { Sheet, SheetContent, SheetTrigger };
