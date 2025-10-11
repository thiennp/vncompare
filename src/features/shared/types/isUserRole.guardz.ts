import type { UserRole } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isOneOf } from 'guardz';

export function isUserRole(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is UserRole {
  return isOneOf<'admin' | 'customer' | 'supplier'>(
    'admin',
    'customer',
    'supplier'
  )(value, config);
}
