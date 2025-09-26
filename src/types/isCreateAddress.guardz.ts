import type { CreateAddress } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isBoolean, isString, isType, isUndefinedOr } from 'guardz';

export function isCreateAddress(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is CreateAddress {
  return isType<CreateAddress>({
    userId: isString,
    name: isString,
    phone: isString,
    address: isString,
    city: isString,
    district: isString,
    ward: isString,
    isDefault: isUndefinedOr(isBoolean)
  })(value, config);
}
