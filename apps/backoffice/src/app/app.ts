import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, User } from './services/auth.service';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  template: `
    <div class="app-container">
      <!-- Top Navigation -->
      <div class="app-toolbar">
        <div class="toolbar-left">
          <button class="menu-toggle" (click)="toggleSidebar()">
            <span class="hamburger"></span>
          </button>
          <span class="app-title">VNCompare Backoffice</span>
        </div>
        <div class="toolbar-right">
          <div class="user-menu" *ngIf="isAuthenticated(); else loginButton">
            <span class="user-name">{{ currentUser()?.firstName || 'Guest' }}</span>
            <button class="btn btn-outline" (click)="logout()">Logout</button>
          </div>
          <ng-template #loginButton>
            <button class="btn btn-primary" (click)="openLoginDialog()">Login</button>
          </ng-template>
        </div>
      </div>

      <div class="main-layout">
        <!-- Sidebar Navigation -->
        <nav class="sidebar" [class.collapsed]="!isSidebarOpen()">
          <ul class="nav-menu">
            <li class="nav-item" [class.active]="currentRoute() === '/dashboard'">
              <a routerLink="/dashboard" class="nav-link">
                <span class="nav-icon">📊</span>
                <span class="nav-text">Dashboard</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('/products')">
              <a routerLink="/products" class="nav-link">
                <span class="nav-icon">📦</span>
                <span class="nav-text">Products</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('/orders')">
              <a routerLink="/orders" class="nav-link">
                <span class="nav-icon">🛒</span>
                <span class="nav-text">Orders</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('/users')">
              <a routerLink="/users" class="nav-link">
                <span class="nav-icon">👥</span>
                <span class="nav-text">Users</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('/suppliers')">
              <a routerLink="/suppliers" class="nav-link">
                <span class="nav-icon">🏢</span>
                <span class="nav-text">Suppliers</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('/addresses')">
              <a routerLink="/addresses" class="nav-link">
                <span class="nav-icon">📍</span>
                <span class="nav-text">Addresses</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('/reviews')">
              <a routerLink="/reviews" class="nav-link">
                <span class="nav-icon">⭐</span>
                <span class="nav-text">Reviews</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('/analytics')">
              <a routerLink="/analytics" class="nav-link">
                <span class="nav-icon">📈</span>
                <span class="nav-text">Analytics</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('/settings')">
              <a routerLink="/settings" class="nav-link">
                <span class="nav-icon">⚙️</span>
                <span class="nav-text">Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Main Content Area -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f8fafc;
    }

    .app-toolbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-toggle {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .menu-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .hamburger {
      display: block;
      width: 20px;
      height: 2px;
      background-color: white;
      position: relative;
    }

    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 2px;
      background-color: white;
      transition: transform 0.2s;
    }

    .hamburger::before {
      top: -6px;
    }

    .hamburger::after {
      top: 6px;
    }

    .app-title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      font-weight: 500;
    }

    .main-layout {
      display: flex;
      flex: 1;
      min-height: calc(100vh - 64px);
    }

    .sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e2e8f0;
      transition: width 0.3s ease;
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      border-bottom: 1px solid #f1f5f9;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      color: #64748b;
      text-decoration: none;
      transition: all 0.2s;
      gap: 12px;
    }

    .nav-link:hover {
      background-color: #f8fafc;
      color: #334155;
    }

    .nav-item.active .nav-link {
      background-color: #e0e7ff;
      color: #3730a3;
      border-right: 3px solid #3730a3;
    }

    .nav-icon {
      font-size: 1.25rem;
      width: 24px;
      text-align: center;
    }

    .nav-text {
      font-weight: 500;
      transition: opacity 0.3s;
    }

    .sidebar.collapsed .nav-text {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      padding: 24px;
      background-color: #f8fafc;
      overflow-y: auto;
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-outline {
      background-color: transparent;
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
    }

    .btn-outline:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .btn-primary {
      background-color: #3730a3;
      color: white;
      border-color: #3730a3;
    }

    .btn-primary:hover {
      background-color: #312e81;
      border-color: #312e81;
    }

    .btn:not(:last-child) {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 64px;
        height: calc(100vh - 64px);
        z-index: 999;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar:not(.collapsed) {
        transform: translateX(0);
      }

      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class App implements OnInit, OnDestroy {
  title = 'VNCompare Backoffice';
  isSidebarOpen = signal(true);
  currentUser = signal<User | null>(null);
  private userSubscription?: Subscription;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  currentRoute(): string {
    return window.location.pathname;
  }

  logout(): void {
    this.authService.logout();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        console.log('Login successful');
      }
    });
  }
}