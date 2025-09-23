import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, User as ApiUser, PaginatedResponse } from '../../services/api.service';

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
          <button class="btn btn-outline" (click)="loadUsers()" [disabled]="loading">
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
          <button class="btn btn-primary" (click)="addUser()">
            ➕ Add User
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
          <button class="btn btn-sm btn-outline" (click)="loadUsers()">Retry</button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section" *ngIf="!loading || users.length > 0">
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
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="SUPPLIER">Supplier</option>
          </select>
          <select [(ngModel)]="statusFilter" (change)="filterUsers()" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button class="btn btn-outline" (click)="clearFilters()">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading && !error">
        <div class="loading-spinner"></div>
        <p>Loading users...</p>
      </div>

      <!-- Users Table -->
      <div class="table-container" *ngIf="!loading || users.length > 0">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
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
              <td class="email-cell">{{ user.email }}</td>
              <td class="phone-cell">{{ user.phone }}</td>
              <td>
                <span class="role-badge" [class]="user.role.toLowerCase()">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class]="user.isActive ? 'active' : 'inactive'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="date-cell">{{ user.createdAt | date:'short' }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn-icon" (click)="viewUser(user)" title="View">
                    👁️
                  </button>
                  <button class="btn-icon" (click)="editUser(user)" title="Edit">
                    ✏️
                  </button>
                  <button class="btn-icon" (click)="toggleUserStatus(user)" [title]="user.isActive ? 'Deactivate' : 'Activate'">
                    {{ user.isActive ? '🚫' : '✅' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-page {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
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
      background: var(--ios-system-background);
      border-radius: var(--ios-radius-2xl);
      border: 0.5px solid var(--ios-opaque-separator);
      box-shadow: var(--ios-shadow-sm);
    }

    .search-box {
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 0.5px solid var(--ios-opaque-separator);
      border-radius: var(--ios-radius-lg);
      font-size: 15px;
      font-family: var(--ios-font-family);
      background-color: var(--ios-system-background);
      color: var(--ios-label);
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--ios-system-blue);
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    .search-input::placeholder {
      color: var(--ios-placeholder-text);
    }

    .filter-controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .filter-select {
      padding: 12px 16px;
      border: 0.5px solid var(--ios-opaque-separator);
      border-radius: var(--ios-radius-lg);
      background: var(--ios-system-background);
      font-size: 15px;
      font-family: var(--ios-font-family);
      color: var(--ios-label);
      min-width: 150px;
      transition: all 0.2s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--ios-system-blue);
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    .error-message {
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .error-icon {
      font-size: 1.25rem;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3730a3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
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
      border-bottom: 1px solid #e5e7eb;
    }

    .users-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
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
      background: #3730a3;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .user-id {
      font-size: 0.75rem;
      color: #64748b;
    }

    .email-cell {
      font-family: monospace;
      font-size: 0.875rem;
    }

    .phone-cell {
      font-family: monospace;
      font-size: 0.875rem;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .role-badge.user {
      background: #dbeafe;
      color: #2563eb;
    }

    .role-badge.supplier {
      background: #d1fae5;
      color: #059669;
    }

    .role-badge.admin {
      background: #fef3c7;
      color: #d97706;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #059669;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .date-cell {
      font-size: 0.875rem;
      color: #64748b;
    }

    .actions-cell {
      min-width: 120px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #f9fafb;
      border-color: #9ca3af;
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
      background-color: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-outline:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .users-page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters-section {
        flex-direction: column;
        gap: 12px;
      }

      .filter-controls {
        flex-wrap: wrap;
        gap: 8px;
      }

      .filter-select {
        min-width: 120px;
        flex: 1;
      }

      .users-table {
        font-size: 14px;
      }

      .users-table th,
      .users-table td {
        padding: 8px;
      }

      .action-buttons {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  loading = false;
  error: string | null = null;
  users: ApiUser[] = [];
  filteredUsers: ApiUser[] = [];
  
  // Filter properties
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getUsers({ limit: 50, page: 1 }).subscribe({
      next: (response: PaginatedResponse<ApiUser>) => {
        this.users = response.data;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
        // Fallback to mock data
        this.loadMockData();
      }
    });
  }

  loadMockData(): void {
    this.users = [
      {
        id: 'USR-001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@vncompare.com',
        phone: '+84901234567',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
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
        role: 'USER',
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        lastLoginAt: '2024-01-14T15:20:00Z',
        ordersCount: 3,
        totalSpent: 2500000
      },
      {
        id: 'USR-003',
        firstName: 'Tran',
        lastName: 'Thi B',
        email: 'tranthib@email.com',
        phone: '+84901234569',
        role: 'SUPPLIER',
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        lastLoginAt: '2024-01-15T09:15:00Z',
        ordersCount: 0,
        totalSpent: 0
      }
    ];
    this.filteredUsers = [...this.users];
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.phone.includes(this.searchTerm);
      
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      
      const matchesStatus = !this.statusFilter || 
        (this.statusFilter === 'active' && user.isActive) ||
        (this.statusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.roleFilter = '';
    this.statusFilter = '';
    this.filteredUsers = [...this.users];
  }

  addUser(): void {
    // Navigate to add user page
    this.router.navigate(['/users/add']);
  }

  viewUser(user: ApiUser): void {
    // Navigate to user detail view
    this.router.navigate(['/users', user.id]);
  }

  editUser(user: ApiUser): void {
    // Navigate to edit user page
    this.router.navigate(['/users', user.id, 'edit']);
  }

  toggleUserStatus(user: ApiUser): void {
    const action = user.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.apiService.toggleUserStatus(user.id).subscribe({
        next: (updatedUser) => {
          // Update user in local array
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.filteredUsers = [...this.users];
          }
          console.log('User status updated successfully');
        },
        error: (error) => {
          console.error('Error updating user status:', error);
          alert('Failed to update user status: ' + this.apiService.handleError(error));
        }
      });
    }
  }
}