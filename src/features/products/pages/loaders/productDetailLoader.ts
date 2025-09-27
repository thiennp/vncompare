import type { LoaderFunctionArgs } from 'react-router-dom';

// Product detail page loader
export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const response = await fetch(`/api/product-detail/${params.id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading product detail:', error);
    return {
      product: null,
      reviews: [],
      totalReviews: 0,
    };
  }
}
