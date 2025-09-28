// Password comparison function
import { hashPassword } from './hashPassword';

export function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
