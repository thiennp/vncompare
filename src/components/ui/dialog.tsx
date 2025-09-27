import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
};

const DialogContent = ({ children, className = '' }: DialogContentProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 ${className}`}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({ children }: DialogHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      {children}
    </div>
  );
};

const DialogTitle = ({ children }: DialogTitleProps) => {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
};

const DialogDescription = ({ children }: DialogDescriptionProps) => {
  return <p className="text-sm text-gray-600 mt-1">{children}</p>;
};

const DialogFooter = ({ children }: DialogFooterProps) => {
  return (
    <div className="flex justify-end space-x-2 p-6 border-t">{children}</div>
  );
};

const DialogClose = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-8 w-8 p-0"
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
