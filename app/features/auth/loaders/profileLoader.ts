import type { LoaderFunctionArgs } from 'react-router-dom';
import { verifyAuth } from './verifyAuthLoader';
import { db } from '../../shared/services/database.server';

// Profile page loader
export async function profileLoader({ request }: LoaderFunctionArgs) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }

    // Get user addresses (for now, return empty array as addresses feature is not implemented)
    const addresses: any[] = [];

    return { user, addresses };
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
