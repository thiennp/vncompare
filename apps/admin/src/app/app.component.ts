import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'VNCompare Admin';
  
  menuItems = [
    {
      label: 'Bảng điều khiển',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Quản lý sản phẩm',
      icon: 'inventory',
      route: '/products'
    },
    {
      label: 'Quản lý giá',
      icon: 'attach_money',
      route: '/pricing'
    },
    {
      label: 'Vận chuyển',
      icon: 'local_shipping',
      route: '/shipping'
    },
    {
      label: 'Địa chỉ',
      icon: 'location_on',
      route: '/addresses'
    },
    {
      label: 'Phân tích',
      icon: 'analytics',
      route: '/analytics'
    }
  ];

  userMenuItems = [
    {
      label: 'Hồ sơ',
      icon: 'person'
    },
    {
      label: 'Cài đặt',
      icon: 'settings'
    },
    {
      label: 'Đăng xuất',
      icon: 'logout'
    }
  ];
}
