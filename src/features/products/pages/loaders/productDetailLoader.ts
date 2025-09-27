import type { LoaderFunctionArgs } from 'react-router-dom';

// Product detail page loader
export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  console.log('ProductDetailLoader called with params:', params);
  try {
    const response = await fetch(`/api/product-detail/${params.id}`);
    console.log('API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
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
