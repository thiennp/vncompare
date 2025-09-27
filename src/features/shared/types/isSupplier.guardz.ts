import type { Supplier } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isBoolean, isString, isType, isUndefinedOr } from 'guardz';

export function isSupplier(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Supplier {
  return isType<Supplier>({
    _id: isUndefinedOr(isString),
    name: isString,
    email: isString,
    phone: isString,
    address: isString,
    isVerified: isUndefinedOr(isBoolean),
    createdAt: isString,
    isActive: isUndefinedOr(isBoolean),
  })(value, config);
}
