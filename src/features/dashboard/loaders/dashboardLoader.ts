import type { LoaderFunctionArgs } from 'react-router-dom';
import { verifyAuth } from '../../auth/loaders/verifyAuthLoader';

// Dashboard page loader
export async function dashboardLoader({ request }: LoaderFunctionArgs) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }

    // TODO: Fetch real data from API
    // For now, return mock data
    const recentOrders = [];
    const addresses = [];

    return {
      user,
      recentOrders,
      addresses,
    };
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
