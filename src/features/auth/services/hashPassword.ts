// Password hashing function using MD5
import CryptoJS from 'crypto-js';

export function hashPassword(password: string): string {
  // Use MD5 for password hashing
  return CryptoJS.MD5(password + 'salt').toString();
}
