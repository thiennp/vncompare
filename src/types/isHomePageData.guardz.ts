import type { HomePageData } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isArrayWithEachItem, isType } from 'guardz';
import { isProduct } from './isProduct.guardz';
import { isSupplier } from './isSupplier.guardz';
import { isReview } from './isReview.guardz';

export function isHomePageData(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is HomePageData {
  return isType<HomePageData>({
    featuredProducts: isArrayWithEachItem(isProduct),
    suppliers: isArrayWithEachItem(isSupplier),
    reviews: isArrayWithEachItem(isReview),
  })(value, config);
}
