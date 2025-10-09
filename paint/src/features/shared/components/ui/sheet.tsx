import * as React from 'react';

const Sheet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`fixed inset-0 z-50 ${className || ''}`}
    {...props}
  />
));
Sheet.displayName = 'Sheet';

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`fixed inset-y-0 right-0 h-full w-3/4 border-l bg-background p-6 shadow-lg sm:max-w-sm ${className || ''}`}
    {...props}
  />
));
SheetContent.displayName = 'SheetContent';

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={`${className || ''}`}
    {...props}
  />
));
SheetTrigger.displayName = 'SheetTrigger';

export { Sheet, SheetContent, SheetTrigger };