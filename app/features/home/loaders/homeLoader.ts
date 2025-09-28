import { db } from '../../shared/services/database.server';
import type { Product } from '../../shared/types';

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

// Home page loader
export async function homeLoader() {
  try {
    // Fetch featured products (active products, limited to 8)
    const { products: dbProducts } = await db.getProducts(
      { isActive: true },
      1,
      8
    );

    // Transform database products to frontend format
    const featuredProducts: Product[] = dbProducts.map(product => ({
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

    // Fetch suppliers (verified suppliers, limited to 6)
    const { suppliers } = await db.getSuppliers({ isVerified: true }, 1, 6);

    // Fetch approved reviews (limited to 6)
    const { reviews } = await db.getReviews(
      undefined,
      { status: 'approved' },
      1,
      6
    );

    return {
      featuredProducts,
      suppliers,
      reviews,
    };
  } catch (error) {
    console.error('Error loading home page data:', error);
    // Return empty arrays as fallback
    return {
      featuredProducts: [],
      suppliers: [],
      reviews: [],
    };
  }
}
