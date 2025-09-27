import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../services/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  options?: SelectOption[];
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

// Create a context for select state
const SelectContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedValue: string;
  onSelect: (value: string) => void;
  options?: SelectOption[];
} | null>(null);

const Select = ({
  value,
  onValueChange,
  children,
  className = '',
  options = [],
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const handleSelect = (newValue: string) => {
    onValueChange(newValue);
    setIsOpen(false);
  };

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
    <SelectContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedValue: value,
        onSelect: handleSelect,
        options,
      }}
    >
      <div ref={selectRef} className={`relative ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({
  children,
  className = '',
  ...domProps
}: SelectTriggerProps) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');

  const { isOpen, setIsOpen } = context;

  return (
    <button
      type="button"
      className={cn(
        'flex h-11 w-full items-center justify-between rounded-xl border border-paint-orange/30 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-paint-orange/60 focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:ring-offset-2 focus:border-paint-orange hover:border-paint-orange/60 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
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
  ...domProps
}: SelectContentProps) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');

  const { isOpen } = context;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-paint-orange/20 bg-white/95 backdrop-blur-sm p-2 text-gray-900 shadow-xl mt-2',
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
      {children}
    </div>
  );
};

const SelectItem = ({
  value,
  children,
  className = '',
  ...props
}: SelectItemProps) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');

  const { onSelect } = context;

  return (
    <div
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-sm outline-none hover:bg-paint-orange/10 hover:text-paint-orange focus:bg-paint-orange/10 focus:text-paint-orange transition-colors duration-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(value);
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
  ...domProps
}: SelectValueProps) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');

  const { selectedValue, options } = context;

  // Find the label for the selected value
  const selectedOption = options?.find(
    option => option.value === selectedValue
  );
  const displayValue = selectedOption ? selectedOption.label : selectedValue;

  return (
    <span className={cn('block truncate', className)} {...domProps}>
      {displayValue || placeholder}
    </span>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
