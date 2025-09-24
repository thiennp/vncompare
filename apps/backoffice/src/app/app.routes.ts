import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard-overview/dashboard-overview.component').then(m => m.DashboardOverviewComponent) },
  { path: 'products', component: ProductsComponent },
  { path: 'products/add', loadComponent: () => import('./components/products/add-product/add-product.component').then(m => m.AddProductComponent) },
  { path: 'products/:id', loadComponent: () => import('./components/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
        { path: 'orders', loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) },
        { path: 'orders/create', loadComponent: () => import('./components/orders/create-order/create-order.component').then(m => m.CreateOrderComponent) },
        { path: 'orders/:id', loadComponent: () => import('./components/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
        { path: 'orders/:id/edit', loadComponent: () => import('./components/orders/order-edit/order-edit.component').then(m => m.OrderEditComponent) },
  { path: 'users', loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent) },
  { path: 'users/add', loadComponent: () => import('./components/users/add-user/add-user.component').then(m => m.AddUserComponent) },
  { path: 'users/:id', loadComponent: () => import('./components/users/user-detail/user-detail.component').then(m => m.UserDetailComponent) },
  { path: 'suppliers', loadComponent: () => import('./components/suppliers/suppliers.component').then(m => m.SuppliersComponent) },
  { path: 'suppliers/add', loadComponent: () => import('./components/suppliers/add-supplier/add-supplier.component').then(m => m.AddSupplierComponent) },
  { path: 'suppliers/:id', loadComponent: () => import('./components/suppliers/supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent) },
  { path: 'addresses', loadComponent: () => import('./components/addresses/addresses.component').then(m => m.AddressesComponent) },
  { path: 'addresses/:id', loadComponent: () => import('./components/addresses/address-detail/address-detail.component').then(m => m.AddressDetailComponent) },
        { path: 'reviews', loadComponent: () => import('./components/reviews/reviews.component').then(m => m.ReviewsComponent) },
        { path: 'reviews/:id', loadComponent: () => import('./components/reviews/review-detail/review-detail.component').then(m => m.ReviewDetailComponent) },
        { path: 'analytics', loadComponent: () => import('./components/analytics/analytics-dashboard/analytics-dashboard.component').then(m => m.AnalyticsDashboardComponent) },
        { path: 'settings', loadComponent: () => import('./components/settings/settings-management/settings-management.component').then(m => m.SettingsManagementComponent) },
        { path: 'coverage-calculator', loadComponent: () => import('./components/coverage-calculator/coverage-calculator.component').then(m => m.CoverageCalculatorComponent) },
        { path: 'shipping-calculator', loadComponent: () => import('./components/shipping-calculator/shipping-calculator.component').then(m => m.ShippingCalculatorComponent) },
        { path: '**', redirectTo: '/dashboard' }
];