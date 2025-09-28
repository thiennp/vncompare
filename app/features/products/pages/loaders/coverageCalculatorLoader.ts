import { db } from '../../../shared/services/database.server';
import type { Product } from '../../../shared/types';

// Type guard for valid categories
function isValidCategory(category: string): category is Product['category'] {
  return [
    'Sơn ngoại thất',
    'Sơn nội thất',
    'Sơn lót',
    'Sơn bóng',
    'Sơn màu',
    'Sơn chống thấm',
  ].includes(category);
}

// Coverage calculator page loader
export async function coverageCalculatorLoader() {
  try {
    // Get all active products
    const { products: dbProducts } = await db.getProducts(
      { isActive: true },
      1,
      1000
    );

    // Transform database products to frontend format
    const products: Product[] = dbProducts.map(product => ({
      _id: product._id,
      name: product.name,
      brand: product.brand || 'Unknown',
      category:
        product.category && isValidCategory(product.category)
          ? product.category
          : 'Sơn nội thất',
      description: product.description,
      price: product.basePrice || 0,
      unit: product.unit || 'liter',
      coverage: product.coverageRate || 10,
      isActive: product.isActive,
      createdAt: product.createdAt,
      images: [],
      specifications: {},
    }));

    return {
      products,
    };
  } catch (error) {
    console.error('Error loading coverage calculator data:', error);
    return {
      products: [],
    };
  }
}
