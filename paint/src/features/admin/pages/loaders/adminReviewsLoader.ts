import type { LoaderFunctionArgs } from 'react-router-dom';
import { db } from '../../../../features/shared/services/database.client';

// Admin reviews page loader
export async function adminReviewsLoader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    // Get all reviews from database (admin can see all)
    const { reviews, total } = await db.getReviews({}, page, 20);

    return {
      reviews,
      total,
      page,
    };
  } catch (error) {
    console.error('Error loading admin reviews data:', error);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    return {
      reviews: [],
      total: 0,
      page,
    };
  }
}