// Orders page loader
export async function ordersLoader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    const apiUrl = new URL('/api/orders', window.location.origin);
    if (status) apiUrl.searchParams.set('status', status);
    apiUrl.searchParams.set('page', page.toString());

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
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
