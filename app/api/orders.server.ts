import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../features/shared/services/database.server';

// Order detail API
export async function orders({ params }: LoaderFunctionArgs) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return {
        order: null,
      };
    }

    // Get order from database
    const order = await db.getOrderById(orderId);
    if (!order) {
      return {
        order: null,
      };
    }

    return {
      order,
    };
  } catch (error) {
    console.error('Error loading order detail:', error);
    return {
      order: null,
    };
  }
}
