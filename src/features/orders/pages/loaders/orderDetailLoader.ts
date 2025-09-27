import type { LoaderFunctionArgs } from 'react-router-dom';

// Order detail page loader
export async function orderDetailLoader({ params }: LoaderFunctionArgs) {
  try {
    const response = await fetch(`/api/orders/${params.id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading order detail:', error);
    return {
      order: null,
    };
  }
}
