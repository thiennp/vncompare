import type { CreateSupplier } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isBoolean, isString, isType, isUndefinedOr } from 'guardz';

export function isCreateSupplier(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is CreateSupplier {
  return isType<CreateSupplier>({
    name: isString,
    email: isString,
    phone: isString,
    address: isString,
    isVerified: isUndefinedOr(isBoolean),
    isActive: isUndefinedOr(isBoolean),
  })(value, config);
}
