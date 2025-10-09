import type { RegisterRequest } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isOneOf, isString, isType, isUndefinedOr } from 'guardz';

export function isRegisterRequest(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is RegisterRequest {
  return isType<RegisterRequest>({
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
