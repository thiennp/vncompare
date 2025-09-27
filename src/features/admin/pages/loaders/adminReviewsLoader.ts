// Admin reviews page loader
export async function adminReviewsLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  
  return {
    reviews: [],
    total: 0,
    search,
    page,
  };
}
