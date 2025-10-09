// Admin suppliers page loader
export async function adminSuppliersLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const page = parseInt(url.searchParams.get('page') || '1');

  return {
    suppliers: [],
    total: 0,
    search,
    page,
  };
}
