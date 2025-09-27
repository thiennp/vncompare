// Admin orders page loader
export async function adminOrdersLoader({ request }: { request: Request }) {
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
