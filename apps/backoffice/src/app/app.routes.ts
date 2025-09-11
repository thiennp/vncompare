import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'orders', loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'users', loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent) },
  { path: 'suppliers', loadComponent: () => import('./components/suppliers/suppliers.component').then(m => m.SuppliersComponent) },
  { path: 'addresses', loadComponent: () => import('./components/addresses/addresses.component').then(m => m.AddressesComponent) },
  { path: 'reviews', loadComponent: () => import('./components/reviews/reviews.component').then(m => m.ReviewsComponent) },
  { path: 'analytics', loadComponent: () => import('./components/analytics/analytics.component').then(m => m.AnalyticsComponent) },
  { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
  { path: '**', redirectTo: '/dashboard' }
];