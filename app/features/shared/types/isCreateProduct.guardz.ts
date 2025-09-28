import type { CreateProduct } from './index';
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

export function isCreateProduct(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is CreateProduct {
  return isType<CreateProduct>({
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
    images: isUndefinedOr(isArrayWithEachItem(isString)),
    specifications: isUndefinedOr(isObjectWithEachItem(isUnknown))
  })(value, config);
}
