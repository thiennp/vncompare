import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./components/product-management/product-management.module').then(m => m.ProductManagementModule)
  },
  {
    path: 'pricing',
    loadChildren: () => import('./components/pricing-management/pricing-management.module').then(m => m.PricingManagementModule)
  },
  {
    path: 'shipping',
    loadChildren: () => import('./components/shipping-management/shipping-management.module').then(m => m.ShippingManagementModule)
  },
  {
    path: 'addresses',
    loadChildren: () => import('./components/address-management/address-management.module').then(m => m.AddressManagementModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./components/analytics/analytics.module').then(m => m.AnalyticsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
