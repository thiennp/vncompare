import type { LoaderFunctionArgs } from 'react-router-dom';

// Orders page loader (client-side)
export async function ordersLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    // TODO: Fetch from API
    // For now, return empty data
    return {
      orders: [],
      total: 0,
      status,
      page,
    };
  } catch (error) {
    console.error('Error loading orders data:', error);
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      orders: [],
      total: 0,
      status,
      page,
    };
  }
}
