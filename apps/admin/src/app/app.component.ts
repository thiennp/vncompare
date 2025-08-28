import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>VNCompare Admin</span>
      <span class="spacer"></span>
      <button mat-icon-button>
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/products" routerLinkActive="active">
            <mat-icon>inventory</mat-icon>
            <span>Products</span>
          </a>
          <a mat-list-item routerLink="/pricing" routerLinkActive="active">
            <mat-icon>attach_money</mat-icon>
            <span>Pricing</span>
          </a>
          <a mat-list-item routerLink="/shipping" routerLinkActive="active">
            <mat-icon>local_shipping</mat-icon>
            <span>Shipping</span>
          </a>
          <a mat-list-item routerLink="/addresses" routerLinkActive="active">
            <mat-icon>location_on</mat-icon>
            <span>Addresses</span>
          </a>
          <a mat-list-item routerLink="/analytics" routerLinkActive="active">
            <mat-icon>analytics</mat-icon>
            <span>Analytics</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    
    .sidenav-container {
      height: calc(100vh - 64px);
    }
    
    .sidenav {
      width: 250px;
    }
    
    .content {
      padding: 20px;
    }
    
    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AppComponent {
  title = 'VNCompare Admin';
  isHandset$ = false; // This would be an Observable in a real app
}
