// Products page loader
export async function productsLoader({ request }: { request: Request }) {
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
