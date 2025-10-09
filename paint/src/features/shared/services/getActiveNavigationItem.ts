// Get active navigation item
import { NavigationItem } from './types';

export function getActiveNavigationItem(
  pathname: string,
  navigation: NavigationItem[]
): NavigationItem | null {
  return navigation.find(item => pathname === item.href) || null;
}
