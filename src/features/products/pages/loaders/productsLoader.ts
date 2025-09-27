// Products page loader
export async function productsLoader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    const apiUrl = new URL('/api/products', window.location.origin);
    if (search) apiUrl.searchParams.set('search', search);
    if (category) apiUrl.searchParams.set('category', category);
    apiUrl.searchParams.set('page', page.toString());

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
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
