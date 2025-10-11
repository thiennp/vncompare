import type { LoaderFunctionArgs } from 'react-router-dom';

// Products page loader (client-side)
export async function productsLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    // TODO: Fetch from API
    // For now, return empty data
    return {
      products: [],
      total: 0,
      search,
      category,
      page,
    };
  } catch (error) {
    console.error('Error loading products data:', error);
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      products: [],
      total: 0,
      search,
      category,
      page,
    };
  }
}
