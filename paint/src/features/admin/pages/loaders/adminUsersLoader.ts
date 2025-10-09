import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../../../../features/shared/services/database.client';

// Admin users page loader
export async function adminUsersLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    // Get all users from database (admin can see all)
    const { users, total } = await db.getUsers({}, page, 20);

    return {
      users,
      total,
      page,
    };
  } catch (error) {
    console.error('Error loading admin users data:', error);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      users: [],
      total: 0,
      page,
    };
  }
}