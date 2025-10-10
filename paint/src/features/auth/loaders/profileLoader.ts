import type { LoaderFunctionArgs } from 'react-router-dom';
import { verifyAuth } from './verifyAuthLoader';

// Profile page loader
export async function profileLoader({ request }: LoaderFunctionArgs) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }

    // TODO: Fetch addresses from database
    const addresses = [];

    return { user, addresses };
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
