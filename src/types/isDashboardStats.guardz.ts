import type { DashboardStats } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isNumber, isType } from 'guardz';

export function isDashboardStats(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is DashboardStats {
  return isType<DashboardStats>({
    totalUsers: isNumber,
    totalProducts: isNumber,
    totalOrders: isNumber,
    totalSuppliers: isNumber,
    totalRevenue: isNumber,
    activeProducts: isNumber,
    verifiedSuppliers: isNumber
  })(value, config);
}
