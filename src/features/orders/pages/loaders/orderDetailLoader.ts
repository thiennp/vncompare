import type { LoaderFunctionArgs } from 'react-router-dom';

// Order detail page loader (client-side)
export async function orderDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return {
        order: null,
      };
    }

    // TODO: Fetch from API
    // For now, return null
    return {
      order: null,
    };
  } catch (error) {
    console.error('Error loading order detail:', error);
    return {
      order: null,
    };
  }
}
