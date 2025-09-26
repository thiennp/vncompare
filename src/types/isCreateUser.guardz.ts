import type { CreateUser } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isOneOf, isString, isType, isUndefinedOr } from 'guardz';

export function isCreateUser(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is CreateUser {
  return isType<CreateUser>({
    email: isString,
    password: isString,
    name: isUndefinedOr(isString),
    phone: isUndefinedOr(isString),
    role: isUndefinedOr(
      isOneOf<'admin' | 'customer' | 'supplier'>(
        'admin',
        'customer',
        'supplier'
      )
    ),
  })(value, config);
}
