import type { User } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isBoolean, isOneOf, isString, isType, isUndefinedOr } from 'guardz';

export function isUser(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is User {
  return isType<User>({
    _id: isUndefinedOr(isString),
    email: isString,
    password: isUndefinedOr(isString),
    name: isUndefinedOr(isString),
    phone: isUndefinedOr(isString),
    role: isOneOf<'admin' | 'customer' | 'supplier'>(
      'admin',
      'customer',
      'supplier'
    ),
    createdAt: isString,
    lastLoginAt: isUndefinedOr(isString),
    resetToken: isUndefinedOr(isString),
    resetTokenExpiry: isUndefinedOr(isString),
    isActive: isUndefinedOr(isBoolean)
  })(value, config);
}
