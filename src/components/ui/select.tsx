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
  const selectRef = React.useRef<HTMLDivElement>(null);

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  // Sync internal state with external value prop
  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
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
  selectedValue,
  onSelect,
  ...domProps
}: SelectTriggerProps & any) => {
  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
      {...domProps}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selectedValue,
          } as any);
        }
        return child;
      })}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

const SelectContent = ({
  children,
  className = '',
  isOpen,
  setIsOpen,
  selectedValue,
  onSelect,
  ...domProps
}: SelectContentProps & any) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-lg mt-1',
        className
      )}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        position: 'absolute',
        top: '100%',
        left: '0',
        right: '0',
        zIndex: 50,
      }}
      {...domProps}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onSelect,
          } as any);
        }
        return child;
      })}
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
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
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
  isOpen,
  setIsOpen,
  onSelect,
  ...domProps
}: SelectValueProps & any) => {
  return (
    <span className={cn('block truncate', className)} {...domProps}>
      {selectedValue || placeholder}
    </span>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
