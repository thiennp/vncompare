import { User } from '../../shared/types';
import { getDatabase } from './getDatabase.server';

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ email });
    return user as User | null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}
