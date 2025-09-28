import type { Product } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import {
  isArrayWithEachItem,
  isBoolean,
  isNumber,
  isObjectWithEachItem,
  isOneOf,
  isString,
  isType,
  isUndefinedOr,
  isUnknown
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
      | 'Sơn bóng'
      | 'Sơn chống thấm'
      | 'Sơn lót'
      | 'Sơn màu'
      | 'Sơn ngoại thất'
      | 'Sơn nội thất'
    >(
      'Sơn bóng',
      'Sơn chống thấm',
      'Sơn lót',
      'Sơn màu',
      'Sơn ngoại thất',
      'Sơn nội thất'
    ),
    description: isUndefinedOr(isString),
    price: isNumber,
    unit: isString,
    coverage: isNumber,
    isActive: isUndefinedOr(isBoolean),
    createdAt: isString,
    images: isUndefinedOr(isArrayWithEachItem(isString)),
    specifications: isUndefinedOr(isObjectWithEachItem(isUnknown))
  })(value, config);
}
