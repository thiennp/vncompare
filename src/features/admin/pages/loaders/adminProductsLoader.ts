// Admin products page loader
export async function adminProductsLoader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    const apiUrl = new URL('/api/admin/products', window.location.origin);
    apiUrl.searchParams.set('page', page.toString());

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading admin products data:', error);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      products: [],
      total: 0,
      page,
    };
  }
}
