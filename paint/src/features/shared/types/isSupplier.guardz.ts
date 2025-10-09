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
    businessInfo: isUndefinedOr(
      isType<{
        license?: string;
        taxCode?: string;
        businessLicense?: string;
      }>({
        license: isUndefinedOr(isString),
        taxCode: isUndefinedOr(isString),
        businessLicense: isUndefinedOr(isString),
      })
    ),
    contactInfo: isUndefinedOr(
      isType<{
        contactPerson?: string;
        position?: string;
        phone?: string;
      }>({
        contactPerson: isUndefinedOr(isString),
        position: isUndefinedOr(isString),
        phone: isUndefinedOr(isString),
      })
    ),
    isVerified: isUndefinedOr(isBoolean),
    createdAt: isString,
    isActive: isUndefinedOr(isBoolean),
  })(value, config);
}
