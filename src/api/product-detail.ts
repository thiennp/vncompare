import { db } from '../features/shared/services/database.server';
import type { Product } from '../features/shared/types';

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

export async function getProductDetailData(productId: string) {
  try {
    const product = await db.getProductById(productId);

    if (!product) {
      return {
        product: null,
        reviews: [],
        totalReviews: 0,
      };
    }

    // Transform to frontend format
    const transformedProduct: Product = {
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
    };

    // Get reviews for this product
    const { reviews } = await db.getReviews(
      product._id?.toString() || '',
      { status: 'approved' },
      1,
      10
    );

    return {
      product: transformedProduct,
      reviews: reviews || [],
      totalReviews: reviews?.length || 0,
    };
  } catch (error) {
    console.error('Error loading product detail:', error);
    return {
      product: null,
      reviews: [],
      totalReviews: 0,
    };
  }
}
