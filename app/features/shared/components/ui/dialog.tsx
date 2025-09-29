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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-[9999]">{children}</div>
    </div>
  );
};

const DialogContent = ({ children, className = '' }: DialogContentProps) => {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full border border-gray-200/60 ${className}`}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({ children }: DialogHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
      {children}
    </div>
  );
};

const DialogTitle = ({ children }: DialogTitleProps) => {
  return (
    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
      {children}
    </h2>
  );
};

const DialogDescription = ({ children }: DialogDescriptionProps) => {
  return (
    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{children}</p>
  );
};

const DialogFooter = ({ children }: DialogFooterProps) => {
  return (
    <div className="flex justify-end space-x-3 p-6 border-t border-gray-200/60">
      {children}
    </div>
  );
};

const DialogClose = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
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
