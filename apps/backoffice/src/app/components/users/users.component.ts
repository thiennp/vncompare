import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'supplier' | 'customer';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  ordersCount: number;
  totalSpent: number;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-page">
      <div class="page-header">
        <div class="header-content">
          <h1>User Management</h1>
          <p>Manage users, roles, and permissions</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportUsers()">
            📤 Export
          </button>
          <button class="btn btn-primary" (click)="addUser()">
            ➕ Add User
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search users..." 
            [(ngModel)]="searchTerm"
            (input)="filterUsers()"
            class="search-input">
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="roleFilter" (change)="filterUsers()" class="filter-select">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
          </select>
          <select [(ngModel)]="statusFilter" (change)="filterUsers()" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td class="user-cell">
                <div class="user-info">
                  <div class="user-avatar">
                    {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="user-id">ID: {{ user.id }}</div>
                  </div>
                </div>
              </td>
              <td class="email-cell">
                <div class="email-info">
                  <span>{{ user.email }}</span>
                  <span class="verified-badge" *ngIf="user.emailVerified">✓</span>
                </div>
              </td>
              <td>{{ user.phone }}</td>
              <td>
                <span class="role-badge" [class]="user.role">
                  {{ user.role | titlecase }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class]="user.isActive ? 'active' : 'inactive'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="orders-cell">{{ user.ordersCount }}</td>
              <td class="spent-cell">₫{{ user.totalSpent | number }}</td>
              <td class="login-cell">{{ user.lastLoginAt | date:'short' }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn-icon" (click)="viewUser(user)" title="View">
                    👁️
                  </button>
                  <button class="btn-icon" (click)="editUser(user)" title="Edit">
                    ✏️
                  </button>
                  <button class="btn-icon" (click)="toggleUserStatus(user)" [title]="user.isActive ? 'Deactivate' : 'Activate'">
                    {{ user.isActive ? '⏸️' : '▶️' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- User Statistics -->
      <div class="user-stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👑</div>
          <div class="stat-content">
            <div class="stat-value">{{ adminUsers }}</div>
            <div class="stat-label">Admins</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏢</div>
          <div class="stat-content">
            <div class="stat-value">{{ supplierUsers }}</div>
            <div class="stat-label">Suppliers</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-content">
            <div class="stat-value">{{ customerUsers }}</div>
            <div class="stat-label">Customers</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-page {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .header-content p {
      color: #64748b;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .search-box {
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
    }

    .filter-controls {
      display: flex;
      gap: 12px;
    }

    .filter-select {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      font-size: 14px;
      min-width: 150px;
    }

    .users-table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th {
      background: #f8fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e2e8f0;
    }

    .users-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .users-table tr:hover {
      background: #f8fafc;
    }

    .user-cell {
      min-width: 200px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-name {
      font-weight: 600;
      color: #1e293b;
    }

    .user-id {
      font-size: 0.75rem;
      color: #64748b;
    }

    .email-cell {
      min-width: 200px;
    }

    .email-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .verified-badge {
      color: #059669;
      font-weight: 600;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .role-badge.admin {
      background: #fef3c7;
      color: #92400e;
    }

    .role-badge.supplier {
      background: #dbeafe;
      color: #1e40af;
    }

    .role-badge.customer {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .orders-cell, .spent-cell {
      text-align: right;
      font-weight: 600;
    }

    .spent-cell {
      color: #059669;
    }

    .login-cell {
      font-size: 0.875rem;
      color: #64748b;
    }

    .actions-cell {
      width: 120px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .btn-icon:hover {
      background: #f1f5f9;
    }

    .user-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
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
      border-color: #d1d5db;
      color: #374151;
    }

    .btn-outline:hover {
      background-color: #f8fafc;
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

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters-section {
        flex-direction: column;
      }

      .filter-controls {
        flex-wrap: wrap;
      }

      .users-table-container {
        overflow-x: auto;
      }

      .user-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';

  users: User[] = [
    {
      id: 'USR-001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@vncompare.com',
      phone: '+84901234567',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: '2024-01-15T10:30:00Z',
      ordersCount: 0,
      totalSpent: 0
    },
    {
      id: 'USR-002',
      firstName: 'Nguyen',
      lastName: 'Van A',
      email: 'nguyenvana@email.com',
      phone: '+84901234568',
      role: 'customer',
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-05T00:00:00Z',
      lastLoginAt: '2024-01-15T14:20:00Z',
      ordersCount: 5,
      totalSpent: 12500000
    },
    {
      id: 'USR-003',
      firstName: 'Tran',
      lastName: 'Thi B',
      email: 'tranthib@email.com',
      phone: '+84901234569',
      role: 'supplier',
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-10T00:00:00Z',
      lastLoginAt: '2024-01-14T09:15:00Z',
      ordersCount: 0,
      totalSpent: 0
    }
  ];

  filteredUsers: User[] = [];

  get totalUsers(): number {
    return this.users.length;
  }

  get adminUsers(): number {
    return this.users.filter(user => user.role === 'admin').length;
  }

  get supplierUsers(): number {
    return this.users.filter(user => user.role === 'supplier').length;
  }

  get customerUsers(): number {
    return this.users.filter(user => user.role === 'customer').length;
  }

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      const matchesStatus = !this.statusFilter || 
                           (this.statusFilter === 'active' && user.isActive) ||
                           (this.statusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  viewUser(user: User): void {
    console.log('View user:', user);
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
  }

  toggleUserStatus(user: User): void {
    user.isActive = !user.isActive;
    console.log('Toggle user status:', user);
  }

  addUser(): void {
    console.log('Add user clicked');
  }

  exportUsers(): void {
    console.log('Export users clicked');
  }
}
