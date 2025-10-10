import type { LoaderFunctionArgs } from 'react-router-dom';

// Product detail page loader (client-side)
export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const productId = params.id;
    if (!productId) {
      return {
        product: null,
        reviews: [],
        totalReviews: 0,
      };
    }

    // TODO: Fetch from API
    // For now, return null
    return {
      product: null,
      reviews: [],
      totalReviews: 0,
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
