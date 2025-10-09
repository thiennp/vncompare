// Get public navigation items
import { NavigationItem } from './types';
import { Calculator, Truck } from 'lucide-react';

export function getPublicNavigation(): NavigationItem[] {
  return [
    {
      name: 'Máy tính độ phủ',
      href: '/coverage-calculator',
      icon: Calculator,
      shortName: 'Tính độ phủ',
    },
    {
      name: 'Tính phí vận chuyển',
      href: '/shipping-calculator',
      icon: Truck,
      shortName: 'Tính phí ship',
    },
  ];
}
