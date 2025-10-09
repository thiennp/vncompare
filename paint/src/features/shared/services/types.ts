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
  shortName: string;
}

// User types
export interface CreateUser {
  name: string;
  email: string;
  role: string;
  phone?: string;
}

// Product types
export interface CreateProduct {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  coverage: number;
  isActive: boolean;
}

// Supplier types
export interface CreateSupplier {
  name: string;
  email: string;
  phone: string;
  address: string;
  verified: boolean;
}
