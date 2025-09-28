import type { ServiceArea } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isArrayWithEachItem, isString, isType, isUndefinedOr } from 'guardz';

export function isServiceArea(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is ServiceArea {
  return isType<ServiceArea>({
    _id: isUndefinedOr(isString),
    supplierId: isString,
    provinces: isArrayWithEachItem(isString),
    districts: isArrayWithEachItem(isString),
    createdAt: isString
  })(value, config);
}
