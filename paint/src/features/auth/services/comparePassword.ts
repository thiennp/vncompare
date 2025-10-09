import bcrypt from 'bcryptjs';

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
