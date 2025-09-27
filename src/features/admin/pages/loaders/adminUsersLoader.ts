// Admin users page loader
export async function adminUsersLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const role = url.searchParams.get('role') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  
  return {
    users: [],
    total: 0,
    search,
    role,
    page,
  };
}
