import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
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
    FormsModule,
    MatDialogModule
  ],
  template: `
    <div class="app-container" *ngIf="isAuthenticated(); else loginScreen">
      <!-- Top Navigation -->
      <div class="app-toolbar">
        <div class="toolbar-left">
          <button class="menu-toggle" (click)="toggleSidebar()">
            <span class="hamburger"></span>
          </button>
          <span class="app-title">VNCompare Backoffice</span>
        </div>
        <div class="toolbar-right">
          <div class="user-menu">
            <span class="user-name">{{ currentUser()?.firstName || 'Guest' }}</span>
            <button class="btn btn-outline" (click)="logout()">Logout</button>
          </div>
        </div>
      </div>

      <div class="main-layout">
        <!-- Sidebar Navigation -->
        <nav class="sidebar" [class.collapsed]="!isSidebarOpen()">
          <ul class="nav-menu">
            <li class="nav-item" [class.active]="currentRoute() === '#dashboard'">
              <a routerLink="/dashboard" class="nav-link">
                <span class="nav-icon">📊</span>
                <span class="nav-text">Dashboard</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#products')">
              <a routerLink="/products" class="nav-link">
                <span class="nav-icon">📦</span>
                <span class="nav-text">Products</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#orders')">
              <a routerLink="/orders" class="nav-link">
                <span class="nav-icon">🛒</span>
                <span class="nav-text">Orders</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#users')">
              <a routerLink="/users" class="nav-link">
                <span class="nav-icon">👥</span>
                <span class="nav-text">Users</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#suppliers')">
              <a routerLink="/suppliers" class="nav-link">
                <span class="nav-icon">🏢</span>
                <span class="nav-text">Suppliers</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#addresses')">
              <a routerLink="/addresses" class="nav-link">
                <span class="nav-icon">📍</span>
                <span class="nav-text">Addresses</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#reviews')">
              <a routerLink="/reviews" class="nav-link">
                <span class="nav-icon">⭐</span>
                <span class="nav-text">Reviews</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#analytics')">
              <a routerLink="/analytics" class="nav-link">
                <span class="nav-icon">📈</span>
                <span class="nav-text">Analytics</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#coverage-calculator')">
              <a routerLink="/coverage-calculator" class="nav-link">
                <span class="nav-icon">🎨</span>
                <span class="nav-text">Coverage Calculator</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#shipping-calculator')">
              <a routerLink="/shipping-calculator" class="nav-link">
                <span class="nav-icon">🚚</span>
                <span class="nav-text">Shipping Calculator</span>
              </a>
            </li>
            <li class="nav-item" [class.active]="currentRoute().startsWith('#settings')">
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

    <!-- Login Screen -->
    <ng-template #loginScreen>
      <div class="login-screen">
        <div class="login-container">
          <div class="login-header">
            <h1>VNCompare Backoffice</h1>
            <p>Please login to access the admin panel</p>
          </div>
          <div class="login-actions">
            <button class="btn btn-primary btn-large" (click)="openLoginDialog()">
              <span class="btn-icon">🔐</span>
              Login to Backoffice
            </button>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :root {
      --ios-blue: #007AFF;
      --ios-green: #34C759;
      --ios-orange: #FF9500;
      --ios-red: #FF3B30;
      --ios-purple: #AF52DE;
      --ios-pink: #FF2D92;
      --ios-teal: #5AC8FA;
      --ios-indigo: #5856D6;
      --ios-gray: #8E8E93;
      --ios-gray2: #AEAEB2;
      --ios-gray3: #C7C7CC;
      --ios-gray4: #D1D1D6;
      --ios-gray5: #E5E5EA;
      --ios-gray6: #F2F2F7;
      --ios-label: #000000;
      --ios-secondary-label: #3C3C43;
      --ios-tertiary-label: #3C3C43;
      --ios-quaternary-label: #2C2C2E;
      --ios-separator: #3C3C43;
      --ios-opaque-separator: #C6C6C8;
      --ios-system-background: #FFFFFF;
      --ios-secondary-system-background: #F2F2F7;
      --ios-tertiary-system-background: #FFFFFF;
      --ios-grouped-background: #F2F2F7;
      --ios-secondary-grouped-background: #FFFFFF;
      --ios-tertiary-grouped-background: #F2F2F7;
      --ios-fill: #787880;
      --ios-secondary-fill: #787880;
      --ios-tertiary-fill: #787880;
      --ios-quaternary-fill: #787880;
      --ios-placeholder-text: #3C3C43;
      --ios-system-blue: #007AFF;
      --ios-system-green: #34C759;
      --ios-system-indigo: #5856D6;
      --ios-system-orange: #FF9500;
      --ios-system-pink: #FF2D92;
      --ios-system-purple: #AF52DE;
      --ios-system-red: #FF3B30;
      --ios-system-teal: #5AC8FA;
      --ios-system-yellow: #FFCC00;
      --ios-system-gray: #8E8E93;
      --ios-system-gray2: #AEAEB2;
      --ios-system-gray3: #C7C7CC;
      --ios-system-gray4: #D1D1D6;
      --ios-system-gray5: #E5E5EA;
      --ios-system-gray6: #F2F2F7;
    }

    * {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--ios-grouped-background);
    }

    .app-toolbar {
      background: var(--ios-system-background);
      color: var(--ios-label);
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.5px solid var(--ios-separator);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .menu-toggle {
      background: none;
      border: none;
      color: var(--ios-label);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-toggle:hover {
      background-color: var(--ios-system-gray6);
    }

    .menu-toggle:active {
      background-color: var(--ios-system-gray5);
      transform: scale(0.95);
    }

    .hamburger {
      display: block;
      width: 18px;
      height: 2px;
      background-color: var(--ios-label);
      position: relative;
      border-radius: 1px;
    }

    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
      width: 18px;
      height: 2px;
      background-color: var(--ios-label);
      transition: transform 0.2s ease;
      border-radius: 1px;
    }

    .hamburger::before {
      top: -5px;
    }

    .hamburger::after {
      top: 5px;
    }

    .app-title {
      font-size: 17px;
      font-weight: 600;
      color: var(--ios-label);
      letter-spacing: -0.4px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-name {
      font-weight: 500;
      font-size: 15px;
      color: var(--ios-secondary-label);
    }

    .main-layout {
      display: flex;
      flex: 1;
      min-height: calc(100vh - 60px);
    }

    .sidebar {
      width: 280px;
      background: var(--ios-system-background);
      border-right: 0.5px solid var(--ios-separator);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 60px;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
      padding-top: 8px;
    }

    .nav-item {
      margin: 0 8px 4px 8px;
      border-radius: 10px;
      overflow: hidden;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: var(--ios-secondary-label);
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      gap: 12px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 500;
    }

    .nav-link:hover {
      background-color: var(--ios-system-gray6);
      color: var(--ios-label);
    }

    .nav-item.active .nav-link {
      background-color: var(--ios-system-blue);
      color: white;
    }

    .nav-item.active .nav-link:hover {
      background-color: var(--ios-system-blue);
      opacity: 0.9;
    }

    .nav-icon {
      font-size: 16px;
      width: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-text {
      font-weight: 500;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }

    .sidebar.collapsed .nav-text {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background-color: var(--ios-grouped-background);
      overflow-y: auto;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 36px;
      letter-spacing: -0.2px;
    }

    .btn:active {
      transform: scale(0.96);
    }

    .btn-outline {
      background-color: var(--ios-system-gray6);
      color: var(--ios-label);
      border: 0.5px solid var(--ios-opaque-separator);
    }

    .btn-outline:hover {
      background-color: var(--ios-system-gray5);
    }

    .btn-outline:active {
      background-color: var(--ios-system-gray4);
    }

    .btn-primary {
      background-color: var(--ios-system-blue);
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056CC;
    }

    .btn-primary:active {
      background-color: #004BB5;
    }

    .btn:not(:last-child) {
      margin-right: 8px;
    }

    .login-screen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--ios-grouped-background);
      padding: 20px;
    }

    .login-container {
      background: var(--ios-system-background);
      border-radius: 16px;
      padding: 40px 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      text-align: center;
      max-width: 400px;
      width: 100%;
      border: 0.5px solid var(--ios-opaque-separator);
    }

    .login-header h1 {
      color: var(--ios-label);
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.6px;
    }

    .login-header p {
      color: var(--ios-secondary-label);
      font-size: 16px;
      margin: 0 0 32px 0;
      line-height: 1.4;
    }

    .btn-large {
      padding: 16px 32px;
      font-size: 17px;
      font-weight: 600;
      min-width: 200px;
      border-radius: 12px;
    }

    .btn-icon {
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .app-toolbar {
        height: 56px;
        padding: 0 16px;
      }

      .sidebar {
        position: fixed;
        left: 0;
        top: 56px;
        height: calc(100vh - 56px);
        z-index: 999;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        width: 280px;
      }

      .sidebar:not(.collapsed) {
        transform: translateX(0);
      }

      .main-content {
        padding: 16px;
      }

      .login-container {
        padding: 32px 24px;
        margin: 0 16px;
        border-radius: 12px;
      }

      .login-header h1 {
        font-size: 24px;
      }

      .nav-item {
        margin: 0 4px 2px 4px;
      }

      .nav-link {
        padding: 10px 12px;
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .app-toolbar {
        padding: 0 12px;
      }

      .app-title {
        font-size: 16px;
      }

      .main-content {
        padding: 12px;
      }

      .login-container {
        padding: 24px 20px;
        margin: 0 12px;
      }

      .login-header h1 {
        font-size: 22px;
      }

      .btn-large {
        padding: 14px 28px;
        font-size: 16px;
        min-width: 180px;
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
    return window.location.hash || '#dashboard';
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