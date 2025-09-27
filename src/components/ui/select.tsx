import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

const Select = ({
  value,
  onValueChange,
  children,
  className = '',
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen,
            setIsOpen,
            selectedValue,
            onSelect: handleSelect,
          } as any);
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({
  children,
  className = '',
  isOpen,
  setIsOpen,
  ...props
}: SelectTriggerProps & any) => {
  // Filter out non-DOM props to avoid React warnings
  const { selectedValue, onSelect, ...domProps } = props;

  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...domProps}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

const SelectContent = ({
  children,
  className = '',
  isOpen,
  ...props
}: SelectContentProps & any) => {
  if (!isOpen) return null;

  // Filter out non-DOM props to avoid React warnings
  const { setIsOpen, selectedValue, onSelect, ...domProps } = props;

  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className
      )}
      {...domProps}
    >
      {children}
    </div>
  );
};

const SelectItem = ({
  value,
  children,
  className = '',
  onSelect,
  ...props
}: SelectItemProps & any) => {
  return (
    <div
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={() => {
        if (typeof onSelect === 'function') {
          onSelect(value);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const SelectValue = ({
  placeholder,
  className = '',
  selectedValue,
  ...props
}: SelectValueProps & any) => {
  // Filter out non-DOM props to avoid React warnings
  const { isOpen, setIsOpen, onSelect, ...domProps } = props;

  return (
    <span className={cn('block truncate', className)} {...domProps}>
      {selectedValue || placeholder}
    </span>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
