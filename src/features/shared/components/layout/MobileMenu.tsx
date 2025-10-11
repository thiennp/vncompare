// Mock mobile menu component for paint project
import React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: any[];
}

export default function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between px-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}