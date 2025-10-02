import type { ProductCoverage } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isNumber, isString, isType, isUndefinedOr } from 'guardz';

export function isProductCoverage(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is ProductCoverage {
  return isType<ProductCoverage>({
    _id: isUndefinedOr(isString),
    productId: isString,
    area: isNumber,
    unit: isString,
    createdAt: isString,
  })(value, config);
}
