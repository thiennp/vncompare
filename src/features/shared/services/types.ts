// Navigation types
import React from 'react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType;
  shortName: string;
}

export interface AdminNavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType;
  shortName?: string;
}
