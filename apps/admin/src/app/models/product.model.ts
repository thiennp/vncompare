export interface Product {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  basePrice: number;
  originalPrice: number;
  coverageRate: number; // m²/liter
  unit: string; // liter, gallon, kg
  colors: string[];
  features: string[];
  images: string[];
  specifications: ProductSpecifications;
  coverage: CoverageData[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductCategory {
  INTERIOR = 'interior',
  EXTERIOR = 'exterior',
  SPECIALTY = 'specialty',
  INDUSTRIAL = 'industrial',
  DECORATIVE = 'decorative',
  ECO_FRIENDLY = 'eco_friendly'
}

export interface ProductSpecifications {
  dryingTime: string;
  vocLevel: string;
  durability: string;
  applicationMethod: string[];
  surfaceTypes: string[];
  safetyData: string;
}

export interface CoverageData {
  id: number;
  surfaceType: string;
  coverageRate: number; // m²/liter
  coatsRequired: number;
  notes: string;
}

export interface ProductFormData {
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  basePrice: number;
  originalPrice: number;
  coverageRate: number;
  unit: string;
  colors: string[];
  features: string[];
  specifications: ProductSpecifications;
  coverage: CoverageData[];
}
