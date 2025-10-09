import type { ShippingZone } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import {
  isArrayWithEachItem,
  isNumber,
  isString,
  isType,
  isUndefinedOr,
} from 'guardz';

export function isShippingZone(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is ShippingZone {
  return isType<ShippingZone>({
    _id: isUndefinedOr(isString),
    name: isString,
    provinces: isArrayWithEachItem(isString),
    shippingCost: isNumber,
    createdAt: isString,
  })(value, config);
}
