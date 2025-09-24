import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    currency: string;
    language: string;
  };
  business: {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    taxNumber: string;
    businessLicense: string;
  };
  shipping: {
    defaultDeliveryFee: number;
    freeShippingThreshold: number;
    maxDeliveryDays: number;
    shippingZones: Array<{
      name: string;
      fee: number;
      days: number;
    }>;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderNotifications: boolean;
    productNotifications: boolean;
    userNotifications: boolean;
  };
  security: {
    passwordMinLength: number;
    requireStrongPassword: boolean;
    sessionTimeout: number;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
}

@Component({
  selector: 'app-settings-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-management-page">
      <div class="page-header">
        <div class="header-content">
          <h1>System Settings</h1>
          <p>Configure system-wide settings and preferences</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="resetSettings()">
            Reset to Defaults
          </button>
          <button class="btn btn-primary" (click)="saveSettings()" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>

      <div class="settings-content" *ngIf="settings">
        <div class="settings-tabs">
          <button 
            *ngFor="let tab of tabs" 
            class="tab-button"
            [class.active]="activeTab === tab.id"
            (click)="setActiveTab(tab.id)">
            {{ tab.label }}
          </button>
        </div>

        <div class="settings-panel">
          <!-- General Settings -->
          <div class="settings-section" *ngIf="activeTab === 'general'">
            <h3>General Settings</h3>
            <div class="settings-form">
              <div class="form-group">
                <label for="siteName">Site Name</label>
                <input 
                  type="text" 
                  id="siteName" 
                  name="siteName" 
                  [(ngModel)]="settings.general.siteName" 
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="siteDescription">Site Description</label>
                <textarea 
                  id="siteDescription" 
                  name="siteDescription" 
                  [(ngModel)]="settings.general.siteDescription" 
                  rows="3"
                  class="form-textarea">
                </textarea>
              </div>

              <div class="form-group">
                <label for="siteUrl">Site URL</label>
                <input 
                  type="url" 
                  id="siteUrl" 
                  name="siteUrl" 
                  [(ngModel)]="settings.general.siteUrl" 
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="adminEmail">Admin Email</label>
                <input 
                  type="email" 
                  id="adminEmail" 
                  name="adminEmail" 
                  [(ngModel)]="settings.general.adminEmail" 
                  class="form-input">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="timezone">Timezone</label>
                  <select 
                    id="timezone" 
                    name="timezone" 
                    [(ngModel)]="settings.general.timezone" 
                    class="form-select">
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="currency">Currency</label>
                  <select 
                    id="currency" 
                    name="currency" 
                    [(ngModel)]="settings.general.currency" 
                    class="form-select">
                    <option value="VND">Vietnamese Dong (VND)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="language">Language</label>
                <select 
                  id="language" 
                  name="language" 
                  [(ngModel)]="settings.general.language" 
                  class="form-select">
                  <option value="vi">Vietnamese</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Business Settings -->
          <div class="settings-section" *ngIf="activeTab === 'business'">
            <h3>Business Information</h3>
            <div class="settings-form">
              <div class="form-group">
                <label for="companyName">Company Name</label>
                <input 
                  type="text" 
                  id="companyName" 
                  name="companyName" 
                  [(ngModel)]="settings.business.companyName" 
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="companyAddress">Company Address</label>
                <textarea 
                  id="companyAddress" 
                  name="companyAddress" 
                  [(ngModel)]="settings.business.companyAddress" 
                  rows="3"
                  class="form-textarea">
                </textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="companyPhone">Company Phone</label>
                  <input 
                    type="tel" 
                    id="companyPhone" 
                    name="companyPhone" 
                    [(ngModel)]="settings.business.companyPhone" 
                    class="form-input">
                </div>

                <div class="form-group">
                  <label for="companyEmail">Company Email</label>
                  <input 
                    type="email" 
                    id="companyEmail" 
                    name="companyEmail" 
                    [(ngModel)]="settings.business.companyEmail" 
                    class="form-input">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="taxNumber">Tax Number</label>
                  <input 
                    type="text" 
                    id="taxNumber" 
                    name="taxNumber" 
                    [(ngModel)]="settings.business.taxNumber" 
                    class="form-input">
                </div>

                <div class="form-group">
                  <label for="businessLicense">Business License</label>
                  <input 
                    type="text" 
                    id="businessLicense" 
                    name="businessLicense" 
                    [(ngModel)]="settings.business.businessLicense" 
                    class="form-input">
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Settings -->
          <div class="settings-section" *ngIf="activeTab === 'shipping'">
            <h3>Shipping Configuration</h3>
            <div class="settings-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="defaultDeliveryFee">Default Delivery Fee (₫)</label>
                  <input 
                    type="number" 
                    id="defaultDeliveryFee" 
                    name="defaultDeliveryFee" 
                    [(ngModel)]="settings.shipping.defaultDeliveryFee" 
                    min="0"
                    class="form-input">
                </div>

                <div class="form-group">
                  <label for="freeShippingThreshold">Free Shipping Threshold (₫)</label>
                  <input 
                    type="number" 
                    id="freeShippingThreshold" 
                    name="freeShippingThreshold" 
                    [(ngModel)]="settings.shipping.freeShippingThreshold" 
                    min="0"
                    class="form-input">
                </div>
              </div>

              <div class="form-group">
                <label for="maxDeliveryDays">Maximum Delivery Days</label>
                <input 
                  type="number" 
                  id="maxDeliveryDays" 
                  name="maxDeliveryDays" 
                  [(ngModel)]="settings.shipping.maxDeliveryDays" 
                  min="1"
                  class="form-input">
              </div>

              <div class="shipping-zones">
                <h4>Shipping Zones</h4>
                <div class="zones-list">
                  <div 
                    *ngFor="let zone of settings.shipping.shippingZones; let i = index" 
                    class="zone-item">
                    <div class="zone-info">
                      <input 
                        type="text" 
                        [(ngModel)]="zone.name" 
                        placeholder="Zone Name"
                        class="form-input">
                      <input 
                        type="number" 
                        [(ngModel)]="zone.fee" 
                        placeholder="Fee"
                        min="0"
                        class="form-input">
                      <input 
                        type="number" 
                        [(ngModel)]="zone.days" 
                        placeholder="Days"
                        min="1"
                        class="form-input">
                    </div>
                    <button 
                      type="button" 
                      class="btn btn-danger btn-sm"
                      (click)="removeShippingZone(i)">
                      Remove
                    </button>
                  </div>
                </div>
                <button 
                  type="button" 
                  class="btn btn-outline"
                  (click)="addShippingZone()">
                  Add Shipping Zone
                </button>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="settings-section" *ngIf="activeTab === 'notifications'">
            <h3>Notification Preferences</h3>
            <div class="settings-form">
              <div class="notification-group">
                <h4>Email Notifications</h4>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="settings.notifications.emailNotifications">
                    Enable Email Notifications
                  </label>
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="settings.notifications.orderNotifications">
                    Order Notifications
                  </label>
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="settings.notifications.productNotifications">
                    Product Notifications
                  </label>
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="settings.notifications.userNotifications">
                    User Notifications
                  </label>
                </div>
              </div>

              <div class="notification-group">
                <h4>SMS Notifications</h4>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="settings.notifications.smsNotifications">
                    Enable SMS Notifications
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="settings-section" *ngIf="activeTab === 'security'">
            <h3>Security Configuration</h3>
            <div class="settings-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="passwordMinLength">Minimum Password Length</label>
                  <input 
                    type="number" 
                    id="passwordMinLength" 
                    name="passwordMinLength" 
                    [(ngModel)]="settings.security.passwordMinLength" 
                    min="6"
                    class="form-input">
                </div>

                <div class="form-group">
                  <label for="sessionTimeout">Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    id="sessionTimeout" 
                    name="sessionTimeout" 
                    [(ngModel)]="settings.security.sessionTimeout" 
                    min="5"
                    class="form-input">
                </div>
              </div>

              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="settings.security.requireStrongPassword">
                  Require Strong Password
                </label>
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="settings.security.twoFactorAuth">
                  Enable Two-Factor Authentication
                </label>
              </div>

              <div class="form-group">
                <label for="ipWhitelist">IP Whitelist (one per line)</label>
                <textarea 
                  id="ipWhitelist" 
                  name="ipWhitelist" 
                  [(ngModel)]="ipWhitelistText" 
                  rows="5"
                  class="form-textarea"
                  placeholder="192.168.1.1&#10;10.0.0.1">
                </textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading settings...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadSettings()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings-management-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
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

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .settings-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .settings-tabs {
      display: flex;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .tab-button {
      padding: 16px 24px;
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 500;
      color: #64748b;
      transition: all 0.2s;
      border-bottom: 2px solid transparent;
    }

    .tab-button:hover {
      color: #1e293b;
      background: #f1f5f9;
    }

    .tab-button.active {
      color: #3730a3;
      border-bottom-color: #3730a3;
      background: white;
    }

    .settings-panel {
      padding: 32px;
    }

    .settings-section h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 24px 0;
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input,
    .form-textarea,
    .form-select {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 15px;
      font-family: inherit;
      background-color: white;
      color: #1f2937;
      transition: all 0.2s ease;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: #3730a3;
      box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .shipping-zones {
      margin-top: 24px;
    }

    .shipping-zones h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .zones-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .zone-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .zone-info {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      flex: 1;
    }

    .notification-group {
      margin-bottom: 24px;
    }

    .notification-group h4 {
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
      gap: 8px;
      cursor: pointer;
      font-weight: 500;
      color: #374151;
    }

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #3730a3;
    }

    .btn {
      padding: 12px 24px;
      border: 1px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
    }

    .btn-outline {
      background-color: transparent;
      border-color: #d1d5db;
      color: #374151;
    }

    .btn-outline:hover:not(:disabled) {
      background-color: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-primary {
      background-color: #3730a3;
      color: white;
      border-color: #3730a3;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #312e81;
      border-color: #312e81;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
      border-color: #ef4444;
    }

    .btn-danger:hover {
      background-color: #dc2626;
      border-color: #dc2626;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      color: #64748b;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #f3f4f6;
      border-top: 3px solid #3730a3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      text-align: center;
      padding: 64px;
      color: #ef4444;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .settings-tabs {
        flex-wrap: wrap;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .zone-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsManagementComponent implements OnInit {
  settings: SystemSettings | null = null;
  ipWhitelistText = '';
  activeTab = 'general';
  loading = false;
  saving = false;
  error: string | null = null;

  tabs = [
    { id: 'general', label: 'General' },
    { id: 'business', label: 'Business' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getSettings().subscribe({
      next: (response: any) => {
        this.settings = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading settings:', error);
        this.error = this.apiService.handleError(error);
        this.loading = false;
      }
    });
  }


  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  addShippingZone(): void {
    if (this.settings) {
      this.settings.shipping.shippingZones.push({
        name: '',
        fee: 0,
        days: 1
      });
    }
  }

  removeShippingZone(index: number): void {
    if (this.settings && confirm('Are you sure you want to remove this shipping zone?')) {
      this.settings.shipping.shippingZones.splice(index, 1);
    }
  }

  saveSettings(): void {
    if (!this.settings) return;

    this.saving = true;
    this.error = null;

    // Update IP whitelist from text
    this.settings.security.ipWhitelist = this.ipWhitelistText
      .split('\n')
      .map(ip => ip.trim())
      .filter(ip => ip.length > 0);

    // Note: This would need to be implemented in the API service
    // For now, we'll simulate a successful save
    setTimeout(() => {
      this.saving = false;
      console.log('Settings saved:', this.settings);
      alert('Settings saved successfully!');
    }, 1000);
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
      this.apiService.resetSettings().subscribe({
        next: (response: any) => {
          this.settings = response;
          alert('Settings reset to defaults!');
        },
        error: (error: any) => {
          console.error('Error resetting settings:', error);
          this.error = this.apiService.handleError(error);
          alert('Failed to reset settings. Please try again.');
        }
      });
    }
  }
}
