import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CompanyProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  website: string;
  description: string;
  logo: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  productUpdates: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
}

interface SystemSettings {
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Settings</h1>
          <p>Manage your account and system preferences</p>
        </div>
      </div>

      <!-- Settings Tabs -->
      <div class="settings-tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'profile'"
          (click)="setActiveTab('profile')">
          🏢 Company Profile
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'notifications'"
          (click)="setActiveTab('notifications')">
          🔔 Notifications
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'system'"
          (click)="setActiveTab('system')">
          ⚙️ System
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'security'"
          (click)="setActiveTab('security')">
          🔒 Security
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'users'"
          (click)="setActiveTab('users')">
          👥 Users
        </button>
      </div>

      <!-- Company Profile Tab -->
      <div class="tab-content" *ngIf="activeTab === 'profile'">
        <div class="settings-card">
          <div class="card-header">
            <h3>Company Information</h3>
            <p>Update your company details and branding</p>
          </div>
          <form class="settings-form" (ngSubmit)="saveProfile()">
            <div class="form-row">
              <div class="form-group">
                <label for="companyName">Company Name</label>
                <input 
                  type="text" 
                  id="companyName" 
                  [(ngModel)]="companyProfile.name" 
                  name="companyName"
                  class="form-input">
              </div>
              <div class="form-group">
                <label for="companyEmail">Email</label>
                <input 
                  type="email" 
                  id="companyEmail" 
                  [(ngModel)]="companyProfile.email" 
                  name="companyEmail"
                  class="form-input">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="companyPhone">Phone</label>
                <input 
                  type="tel" 
                  id="companyPhone" 
                  [(ngModel)]="companyProfile.phone" 
                  name="companyPhone"
                  class="form-input">
              </div>
              <div class="form-group">
                <label for="companyWebsite">Website</label>
                <input 
                  type="url" 
                  id="companyWebsite" 
                  [(ngModel)]="companyProfile.website" 
                  name="companyWebsite"
                  class="form-input">
              </div>
            </div>
            <div class="form-group">
              <label for="companyAddress">Address</label>
              <input 
                type="text" 
                id="companyAddress" 
                [(ngModel)]="companyProfile.address" 
                name="companyAddress"
                class="form-input">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="companyCity">City</label>
                <input 
                  type="text" 
                  id="companyCity" 
                  [(ngModel)]="companyProfile.city" 
                  name="companyCity"
                  class="form-input">
              </div>
              <div class="form-group">
                <label for="companyProvince">Province</label>
                <input 
                  type="text" 
                  id="companyProvince" 
                  [(ngModel)]="companyProfile.province" 
                  name="companyProvince"
                  class="form-input">
              </div>
              <div class="form-group">
                <label for="companyPostalCode">Postal Code</label>
                <input 
                  type="text" 
                  id="companyPostalCode" 
                  [(ngModel)]="companyProfile.postalCode" 
                  name="companyPostalCode"
                  class="form-input">
              </div>
            </div>
            <div class="form-group">
              <label for="companyDescription">Description</label>
              <textarea 
                id="companyDescription" 
                [(ngModel)]="companyProfile.description" 
                name="companyDescription"
                class="form-textarea"
                rows="4"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div class="tab-content" *ngIf="activeTab === 'notifications'">
        <div class="settings-card">
          <div class="card-header">
            <h3>Notification Preferences</h3>
            <p>Choose how you want to be notified about important events</p>
          </div>
          <form class="settings-form" (ngSubmit)="saveNotifications()">
            <div class="notification-section">
              <h4>Email Notifications</h4>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationSettings.emailNotifications" 
                    name="emailNotifications">
                  <span class="checkmark"></span>
                  Enable email notifications
                </label>
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationSettings.orderUpdates" 
                    name="orderUpdates">
                  <span class="checkmark"></span>
                  Order updates and status changes
                </label>
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationSettings.productUpdates" 
                    name="productUpdates">
                  <span class="checkmark"></span>
                  Product updates and new arrivals
                </label>
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationSettings.systemAlerts" 
                    name="systemAlerts">
                  <span class="checkmark"></span>
                  System alerts and maintenance
                </label>
              </div>
            </div>

            <div class="notification-section">
              <h4>SMS Notifications</h4>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationSettings.smsNotifications" 
                    name="smsNotifications">
                  <span class="checkmark"></span>
                  Enable SMS notifications
                </label>
              </div>
            </div>

            <div class="notification-section">
              <h4>Marketing</h4>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="notificationSettings.marketingEmails" 
                    name="marketingEmails">
                  <span class="checkmark"></span>
                  Receive marketing emails and promotions
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Preferences</button>
            </div>
          </form>
        </div>
      </div>

      <!-- System Tab -->
      <div class="tab-content" *ngIf="activeTab === 'system'">
        <div class="settings-card">
          <div class="card-header">
            <h3>System Preferences</h3>
            <p>Configure your system settings and preferences</p>
          </div>
          <form class="settings-form" (ngSubmit)="saveSystemSettings()">
            <div class="form-row">
              <div class="form-group">
                <label for="timezone">Timezone</label>
                <select 
                  id="timezone" 
                  [(ngModel)]="systemSettings.timezone" 
                  name="timezone"
                  class="form-select">
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                </select>
              </div>
              <div class="form-group">
                <label for="currency">Currency</label>
                <select 
                  id="currency" 
                  [(ngModel)]="systemSettings.currency" 
                  name="currency"
                  class="form-select">
                  <option value="VND">Vietnamese Dong (₫)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="language">Language</label>
                <select 
                  id="language" 
                  [(ngModel)]="systemSettings.language" 
                  name="language"
                  class="form-select">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div class="form-group">
                <label for="theme">Theme</label>
                <select 
                  id="theme" 
                  [(ngModel)]="systemSettings.theme" 
                  name="theme"
                  class="form-select">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="dateFormat">Date Format</label>
                <select 
                  id="dateFormat" 
                  [(ngModel)]="systemSettings.dateFormat" 
                  name="dateFormat"
                  class="form-select">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div class="form-group">
                <label for="timeFormat">Time Format</label>
                <select 
                  id="timeFormat" 
                  [(ngModel)]="systemSettings.timeFormat" 
                  name="timeFormat"
                  class="form-select">
                  <option value="12">12 Hour (AM/PM)</option>
                  <option value="24">24 Hour</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Settings</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Security Tab -->
      <div class="tab-content" *ngIf="activeTab === 'security'">
        <div class="settings-card">
          <div class="card-header">
            <h3>Security Settings</h3>
            <p>Manage your account security and access</p>
          </div>
          <div class="security-sections">
            <div class="security-section">
              <h4>Change Password</h4>
              <form class="password-form" (ngSubmit)="changePassword()">
                <div class="form-group">
                  <label for="currentPassword">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    [(ngModel)]="passwordForm.currentPassword" 
                    name="currentPassword"
                    class="form-input">
                </div>
                <div class="form-group">
                  <label for="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    [(ngModel)]="passwordForm.newPassword" 
                    name="newPassword"
                    class="form-input">
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    [(ngModel)]="passwordForm.confirmPassword" 
                    name="confirmPassword"
                    class="form-input">
                </div>
                <button type="submit" class="btn btn-primary">Change Password</button>
              </form>
            </div>

            <div class="security-section">
              <h4>Two-Factor Authentication</h4>
              <div class="security-status">
                <span class="status-badge disabled">Disabled</span>
                <button class="btn btn-outline">Enable 2FA</button>
              </div>
            </div>

            <div class="security-section">
              <h4>Active Sessions</h4>
              <div class="sessions-list">
                <div class="session-item">
                  <div class="session-info">
                    <div class="session-device">Chrome on Windows</div>
                    <div class="session-location">Ho Chi Minh City, Vietnam</div>
                    <div class="session-time">Last active: 2 hours ago</div>
                  </div>
                  <button class="btn btn-sm btn-outline danger">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div class="tab-content" *ngIf="activeTab === 'users'">
        <div class="settings-card">
          <div class="card-header">
            <h3>User Management</h3>
            <p>Manage team members and their permissions</p>
          </div>
          <div class="users-section">
            <div class="users-header">
              <button class="btn btn-primary" (click)="inviteUser()">
                ➕ Invite User
              </button>
            </div>
            <div class="users-list">
              <div class="user-item" *ngFor="let user of teamUsers">
                <div class="user-info">
                  <div class="user-avatar">
                    {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="user-email">{{ user.email }}</div>
                    <div class="user-role">{{ user.role | titlecase }}</div>
                  </div>
                </div>
                <div class="user-actions">
                  <button class="btn btn-sm btn-outline" (click)="editUser(user)">Edit</button>
                  <button class="btn btn-sm btn-outline danger" (click)="removeUser(user)">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: #64748b;
      margin: 0;
    }

    .settings-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
      overflow-x: auto;
    }

    .tab-btn {
      padding: 12px 24px;
      border: none;
      background: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-weight: 500;
      color: #64748b;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: #3730a3;
    }

    .tab-btn.active {
      color: #3730a3;
      border-bottom-color: #3730a3;
    }

    .tab-content {
      min-height: 400px;
    }

    .settings-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .card-header {
      margin-bottom: 32px;
    }

    .card-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .card-header p {
      color: #64748b;
      margin: 0;
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 500;
      color: #374151;
    }

    .form-input, .form-select, .form-textarea {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #3730a3;
      box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 24px;
      border-top: 1px solid #f1f5f9;
    }

    .notification-section {
      margin-bottom: 32px;
    }

    .notification-section h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-weight: 500;
      color: #374151;
    }

    .checkbox-label input[type="checkbox"] {
      display: none;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid #d1d5db;
      border-radius: 4px;
      position: relative;
      transition: all 0.2s;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark {
      background: #3730a3;
      border-color: #3730a3;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .security-sections {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .security-section h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
    }

    .security-status {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-badge.disabled {
      background: #fee2e2;
      color: #dc2626;
    }

    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
    }

    .session-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .session-device {
      font-weight: 500;
      color: #1e293b;
    }

    .session-location, .session-time {
      font-size: 0.875rem;
      color: #64748b;
    }

    .users-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .users-header {
      display: flex;
      justify-content: flex-end;
    }

    .users-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .user-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
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

    .user-email, .user-role {
      font-size: 0.875rem;
      color: #64748b;
    }

    .user-actions {
      display: flex;
      gap: 8px;
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

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.875rem;
    }

    .btn-outline {
      background-color: transparent;
      border-color: #d1d5db;
      color: #374151;
    }

    .btn-outline:hover {
      background-color: #f8fafc;
    }

    .btn-outline.danger {
      border-color: #dc2626;
      color: #dc2626;
    }

    .btn-outline.danger:hover {
      background-color: #fee2e2;
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
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .settings-tabs {
        flex-wrap: wrap;
      }

      .user-item, .session-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .user-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  activeTab = 'profile';

  companyProfile: CompanyProfile = {
    name: 'VNCompare',
    email: 'contact@vncompare.com',
    phone: '+84901234567',
    address: '123 Nguyen Hue Boulevard',
    city: 'Ho Chi Minh City',
    province: 'Ho Chi Minh',
    postalCode: '700000',
    website: 'https://vncompare.com',
    description: 'Vietnam\'s premier paint comparison platform',
    logo: ''
  };

  notificationSettings: NotificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    productUpdates: true,
    systemAlerts: true,
    marketingEmails: false
  };

  systemSettings: SystemSettings = {
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    language: 'vi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    theme: 'light'
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  teamUsers = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@vncompare.com',
      role: 'admin'
    },
    {
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@vncompare.com',
      role: 'manager'
    }
  ];

  ngOnInit(): void {
    // Initialize settings
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  saveProfile(): void {
    console.log('Save profile:', this.companyProfile);
  }

  saveNotifications(): void {
    console.log('Save notifications:', this.notificationSettings);
  }

  saveSystemSettings(): void {
    console.log('Save system settings:', this.systemSettings);
  }

  changePassword(): void {
    console.log('Change password:', this.passwordForm);
  }

  inviteUser(): void {
    console.log('Invite user clicked');
  }

  editUser(user: any): void {
    console.log('Edit user:', user);
  }

  removeUser(user: any): void {
    console.log('Remove user:', user);
  }
}
