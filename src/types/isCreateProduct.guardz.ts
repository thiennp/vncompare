import type { CreateProduct } from './index';
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

export function isCreateProduct(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is CreateProduct {
  return isType<CreateProduct>({
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
    images: isUndefinedOr(isArrayWithEachItem(isString)),
    specifications: isUndefinedOr(isObjectWithEachItem(isAny)),
  })(value, config);
}
