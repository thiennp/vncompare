import type { Product } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import {
  isAny,
  isArrayWithEachItem,
  isBoolean,
  isNumber,
  isObjectWithEachItem,
  isOneOf,
  isString,
  isType,
  isUndefinedOr
} from 'guardz';

export function isProduct(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Product {
  return isType<Product>({
    _id: isUndefinedOr(isString),
    name: isString,
    brand: isString,
    category: isOneOf<
      | 'Exterior Paint'
      | 'Interior Paint'
      | 'Primer'
      | 'Sealer'
      | 'Stain'
      | 'Varnish'
    >(
      'Exterior Paint',
      'Interior Paint',
      'Primer',
      'Sealer',
      'Stain',
      'Varnish'
    ),
    description: isUndefinedOr(isString),
    price: isNumber,
    unit: isString,
    coverage: isNumber,
    isActive: isUndefinedOr(isBoolean),
    createdAt: isString,
    images: isUndefinedOr(isArrayWithEachItem(isString)),
    specifications: isUndefinedOr(isObjectWithEachItem(isAny))
  })(value, config);
}
