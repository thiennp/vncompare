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

export async function getProductsData(
  search = '',
  category = '',
  page = 1,
  limit = 20
) {
  try {
    // Build filters
    const filters: Record<string, unknown> = { isActive: true };

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filters.category = category;
    }

    // Fetch products from database
    const { products: dbProducts, total } = await db.getProducts(
      filters,
      page,
      limit
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
      total,
      search,
      category,
      page,
    };
  } catch (error) {
    console.error('Error loading products data:', error);
    return {
      products: [],
      total: 0,
      search,
      category,
      page,
    };
  }
}

export async function getProductDetailData(productId: string) {
  try {
    const product = await db.getProductById(productId);

    if (!product) {
      return { product: null };
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

    return { product: transformedProduct };
  } catch (error) {
    console.error('Error loading product detail:', error);
    return { product: null };
  }
}
