import type { ProductCategory } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isOneOf } from 'guardz';

export function isProductCategory(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is ProductCategory {
  return isOneOf<
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
  )(value, config);
}
