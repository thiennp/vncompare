import React, { useCallback, useEffect, useRef, useState } from 'react';

export type PaintTypeOption = 'interior' | 'exterior' | 'specialty';

export interface UsePaintTypeDropdownResult {
  isOpen: boolean;
  selectedOption: PaintTypeOption | '';
  containerRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  listboxId: string;
  toggleOpen: () => void;
  close: () => void;
  selectOption: (value: PaintTypeOption) => void;
}

export default function usePaintTypeDropdown(): UsePaintTypeDropdownResult {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<PaintTypeOption | ''>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = 'paint-type-listbox';

  const close = useCallback(() => setIsOpen(false), []);
  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

  const selectOption = useCallback((value: PaintTypeOption) => {
    setSelectedOption(value);
    setIsOpen(false);
    // return focus to button for accessibility
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      const container = containerRef.current;
      if (container && !container.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return {
    isOpen,
    selectedOption,
    containerRef,
    buttonRef,
    listboxId,
    toggleOpen,
    close,
    selectOption,
  };
}

