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
  isUndefinedOr,
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
      | 'Sơn ngoại thất'
      | 'Sơn nội thất'
      | 'Sơn lót'
      | 'Sơn bóng'
      | 'Sơn màu'
      | 'Sơn chống thấm'
    >(
      'Sơn ngoại thất',
      'Sơn nội thất',
      'Sơn lót',
      'Sơn bóng',
      'Sơn màu',
      'Sơn chống thấm'
    ),
    description: isUndefinedOr(isString),
    price: isNumber,
    unit: isString,
    coverage: isNumber,
    isActive: isUndefinedOr(isBoolean),
    createdAt: isString,
    images: isUndefinedOr(isArrayWithEachItem(isString)),
    specifications: isUndefinedOr(isObjectWithEachItem(isAny)),
  })(value, config);
}
