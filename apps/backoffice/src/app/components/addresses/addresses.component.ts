import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Address {
  id: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  postalCode: string;
  isServiceArea: boolean;
  deliveryFee: number;
  estimatedDays: number;
  createdAt: string;
  updatedAt: string;
}

interface Province {
  id: string;
  name: string;
  code: string;
  districtsCount: number;
  serviceAreasCount: number;
}

interface District {
  id: string;
  name: string;
  code: string;
  provinceId: string;
  wardsCount: number;
  serviceAreasCount: number;
}

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="addresses-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Address Management</h1>
          <p>Manage Vietnam addresses, service areas, and delivery zones</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportAddresses()">
            📤 Export
          </button>
          <button class="btn btn-primary" (click)="addAddress()">
            ➕ Add Address
          </button>
        </div>
      </div>

      <!-- Address Tabs -->
      <div class="address-tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'addresses'"
          (click)="setActiveTab('addresses')">
          📍 Addresses
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'provinces'"
          (click)="setActiveTab('provinces')">
          🏛️ Provinces
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'districts'"
          (click)="setActiveTab('districts')">
          🏘️ Districts
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'service-areas'"
          (click)="setActiveTab('service-areas')">
          🚚 Service Areas
        </button>
      </div>

      <!-- Addresses Tab -->
      <div class="tab-content" *ngIf="activeTab === 'addresses'">
        <div class="filters-section">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search addresses..." 
              [(ngModel)]="searchTerm"
              (input)="filterAddresses()"
              class="search-input">
          </div>
          <div class="filter-controls">
            <select [(ngModel)]="provinceFilter" (change)="filterAddresses()" class="filter-select">
              <option value="">All Provinces</option>
              <option *ngFor="let province of provinces" [value]="province.id">
                {{ province.name }}
              </option>
            </select>
            <select [(ngModel)]="serviceAreaFilter" (change)="filterAddresses()" class="filter-select">
              <option value="">All Areas</option>
              <option value="service">Service Areas</option>
              <option value="non-service">Non-Service Areas</option>
            </select>
          </div>
        </div>

        <div class="addresses-table-container">
          <table class="addresses-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Ward</th>
                <th>District</th>
                <th>Province</th>
                <th>Postal Code</th>
                <th>Service Area</th>
                <th>Delivery Fee</th>
                <th>Est. Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let address of filteredAddresses">
                <td class="address-cell">{{ address.street }}</td>
                <td>{{ address.ward }}</td>
                <td>{{ address.district }}</td>
                <td>{{ address.province }}</td>
                <td>{{ address.postalCode }}</td>
                <td>
                  <span class="service-badge" [class]="address.isServiceArea ? 'service' : 'non-service'">
                    {{ address.isServiceArea ? 'Service Area' : 'Non-Service' }}
                  </span>
                </td>
                <td class="fee-cell">₫{{ address.deliveryFee | number }}</td>
                <td class="days-cell">{{ address.estimatedDays }} days</td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="editAddress(address)" title="Edit">
                      ✏️
                    </button>
                    <button class="btn-icon" (click)="toggleServiceArea(address)" [title]="address.isServiceArea ? 'Remove from Service' : 'Add to Service'">
                      {{ address.isServiceArea ? '🚫' : '✅' }}
                    </button>
                    <button class="btn-icon danger" (click)="deleteAddress(address)" title="Delete">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Provinces Tab -->
      <div class="tab-content" *ngIf="activeTab === 'provinces'">
        <div class="provinces-grid">
          <div class="province-card" *ngFor="let province of provinces">
            <div class="province-header">
              <h3>{{ province.name }}</h3>
              <span class="province-code">{{ province.code }}</span>
            </div>
            <div class="province-stats">
              <div class="stat">
                <span class="stat-label">Districts:</span>
                <span class="stat-value">{{ province.districtsCount }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Service Areas:</span>
                <span class="stat-value">{{ province.serviceAreasCount }}</span>
              </div>
            </div>
            <div class="province-actions">
              <button class="btn btn-sm btn-outline" (click)="viewProvince(province)">View Details</button>
              <button class="btn btn-sm btn-primary" (click)="editProvince(province)">Edit</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Districts Tab -->
      <div class="tab-content" *ngIf="activeTab === 'districts'">
        <div class="districts-table-container">
          <table class="districts-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Code</th>
                <th>Province</th>
                <th>Wards</th>
                <th>Service Areas</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let district of districts">
                <td class="district-cell">{{ district.name }}</td>
                <td>{{ district.code }}</td>
                <td>{{ getProvinceName(district.provinceId) }}</td>
                <td class="wards-cell">{{ district.wardsCount }}</td>
                <td class="service-areas-cell">{{ district.serviceAreasCount }}</td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="viewDistrict(district)" title="View">
                      👁️
                    </button>
                    <button class="btn-icon" (click)="editDistrict(district)" title="Edit">
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Service Areas Tab -->
      <div class="tab-content" *ngIf="activeTab === 'service-areas'">
        <div class="service-areas-map">
          <div class="map-placeholder">
            <div class="map-icon">🗺️</div>
            <h3>Service Areas Map</h3>
            <p>Interactive map showing all service areas and delivery zones</p>
            <button class="btn btn-primary">Open Map</button>
          </div>
        </div>
        
        <div class="service-areas-stats">
          <div class="stat-card">
            <div class="stat-icon">📍</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalServiceAreas }}</div>
              <div class="stat-label">Service Areas</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏛️</div>
            <div class="stat-content">
              <div class="stat-value">{{ coveredProvinces }}</div>
              <div class="stat-label">Covered Provinces</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏘️</div>
            <div class="stat-content">
              <div class="stat-value">{{ coveredDistricts }}</div>
              <div class="stat-label">Covered Districts</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value">{{ averageDeliveryDays }}</div>
              <div class="stat-label">Avg. Delivery Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .addresses-page {
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

    .address-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
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

    .addresses-table-container, .districts-table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .addresses-table, .districts-table {
      width: 100%;
      border-collapse: collapse;
    }

    .addresses-table th, .districts-table th {
      background: #f8fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e2e8f0;
    }

    .addresses-table td, .districts-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .addresses-table tr:hover, .districts-table tr:hover {
      background: #f8fafc;
    }

    .address-cell {
      min-width: 200px;
      font-weight: 500;
    }

    .service-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .service-badge.service {
      background: #d1fae5;
      color: #065f46;
    }

    .service-badge.non-service {
      background: #f3f4f6;
      color: #6b7280;
    }

    .fee-cell, .days-cell {
      text-align: right;
      font-weight: 600;
    }

    .fee-cell {
      color: #059669;
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

    .btn-icon.danger:hover {
      background: #fee2e2;
    }

    .provinces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .province-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .province-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .province-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .province-code {
      background: #f1f5f9;
      color: #64748b;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .province-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .province-actions {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.875rem;
    }

    .service-areas-map {
      background: white;
      border-radius: 12px;
      padding: 48px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      text-align: center;
      margin-bottom: 24px;
    }

    .map-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .map-icon {
      font-size: 4rem;
    }

    .map-placeholder h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .map-placeholder p {
      color: #64748b;
      margin: 0;
    }

    .service-areas-stats {
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

      .address-tabs {
        flex-wrap: wrap;
      }

      .filters-section {
        flex-direction: column;
      }

      .filter-controls {
        flex-wrap: wrap;
      }

      .addresses-table-container, .districts-table-container {
        overflow-x: auto;
      }

      .provinces-grid {
        grid-template-columns: 1fr;
      }

      .service-areas-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AddressesComponent implements OnInit {
  activeTab = 'addresses';
  searchTerm = '';
  provinceFilter = '';
  serviceAreaFilter = '';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  addresses: Address[] = [
    {
      id: 'ADDR-001',
      street: '123 Nguyen Hue Boulevard',
      ward: 'Ward 1',
      district: 'District 1',
      province: 'Ho Chi Minh City',
      postalCode: '700000',
      isServiceArea: true,
      deliveryFee: 50000,
      estimatedDays: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'ADDR-002',
      street: '456 Le Loi Street',
      ward: 'Ward 2',
      district: 'District 1',
      province: 'Ho Chi Minh City',
      postalCode: '700000',
      isServiceArea: true,
      deliveryFee: 50000,
      estimatedDays: 1,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    }
  ];

  filteredAddresses: Address[] = [];

  provinces: Province[] = [
    { id: '1', name: 'Ho Chi Minh City', code: 'SG', districtsCount: 24, serviceAreasCount: 20 },
    { id: '2', name: 'Hanoi', code: 'HN', districtsCount: 12, serviceAreasCount: 10 },
    { id: '3', name: 'Da Nang', code: 'DN', districtsCount: 8, serviceAreasCount: 6 },
    { id: '4', name: 'Can Tho', code: 'CT', districtsCount: 9, serviceAreasCount: 5 }
  ];

  districts: District[] = [
    { id: '1', name: 'District 1', code: 'Q1', provinceId: '1', wardsCount: 10, serviceAreasCount: 8 },
    { id: '2', name: 'District 2', code: 'Q2', provinceId: '1', wardsCount: 11, serviceAreasCount: 6 },
    { id: '3', name: 'Ba Dinh', code: 'BD', provinceId: '2', wardsCount: 14, serviceAreasCount: 10 },
    { id: '4', name: 'Hai Chau', code: 'HC', provinceId: '3', wardsCount: 13, serviceAreasCount: 8 }
  ];

  /**
   * Gets the total number of service areas
   * @returns The count of service areas
   */
  get totalServiceAreas(): number {
    return this.addresses.filter(addr => addr.isServiceArea).length;
  }

  /**
   * Gets the number of covered provinces
   * @returns The count of unique provinces with service areas
   */
  get coveredProvinces(): number {
    const uniqueProvinces = new Set(this.addresses.filter(addr => addr.isServiceArea).map(addr => addr.province));
    return uniqueProvinces.size;
  }

  /**
   * Gets the number of covered districts
   * @returns The count of unique districts with service areas
   */
  get coveredDistricts(): number {
    const uniqueDistricts = new Set(this.addresses.filter(addr => addr.isServiceArea).map(addr => addr.district));
    return uniqueDistricts.size;
  }

  /**
   * Gets the average delivery days for service areas
   * @returns The average delivery days
   */
  get averageDeliveryDays(): number {
    const serviceAreas = this.addresses.filter(addr => addr.isServiceArea);
    if (serviceAreas.length === 0) return 0;
    const totalDays = serviceAreas.reduce((sum, addr) => sum + addr.estimatedDays, 0);
    return Math.round(totalDays / serviceAreas.length);
  }

  /**
   * Angular lifecycle hook - initializes the component
   */
  ngOnInit(): void {
    this.filteredAddresses = [...this.addresses];
  }

  /**
   * Sets the active tab
   * @param tab - The tab name to activate
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Filters addresses based on search criteria
   */
  filterAddresses(): void {
    this.filteredAddresses = this.addresses.filter(address => {
      const matchesSearch = address.street.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           address.ward.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           address.district.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           address.province.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesProvince = !this.provinceFilter || address.province === this.provinceFilter;
      const matchesServiceArea = !this.serviceAreaFilter || 
                                (this.serviceAreaFilter === 'service' && address.isServiceArea) ||
                                (this.serviceAreaFilter === 'non-service' && !address.isServiceArea);
      
      return matchesSearch && matchesProvince && matchesServiceArea;
    });
  }

  /**
   * Gets province name by ID
   * @param provinceId - The province ID
   * @returns The province name or 'Unknown'
   */
  getProvinceName(provinceId: string): string {
    const province = this.provinces.find(p => p.id === provinceId);
    return province ? province.name : 'Unknown';
  }

  /**
   * Navigates to edit address page
   * @param address - The address to edit
   */
  editAddress(address: Address): void {
    this.router.navigate(['/addresses', address.id, 'edit']);
  }

  /**
   * Toggles service area status for an address
   * @param address - The address to toggle
   */
  toggleServiceArea(address: Address): void {
    if (confirm(`Are you sure you want to ${address.isServiceArea ? 'remove from' : 'add to'} service area?`)) {
      this.apiService.updateAddress(address.id, { isServiceArea: !address.isServiceArea }).subscribe({
        next: (updatedAddress: any) => {
          // Update address in local array
          const index = this.addresses.findIndex(a => a.id === address.id);
          if (index !== -1) {
            this.addresses[index] = updatedAddress;
            this.filteredAddresses = [...this.addresses];
          }
          console.log('Address service area status updated successfully');
        },
        error: (error: any) => {
          console.error('Error updating address:', error);
          alert('Failed to update address: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  /**
   * Deletes an address
   * @param address - The address to delete
   */
  deleteAddress(address: Address): void {
    if (confirm(`Are you sure you want to delete this address?`)) {
      this.apiService.deleteAddress(address.id).subscribe({
        next: () => {
          // Remove address from local array
          this.addresses = this.addresses.filter(a => a.id !== address.id);
          this.filteredAddresses = this.filteredAddresses.filter(a => a.id !== address.id);
          console.log('Address deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting address:', error);
          alert('Failed to delete address: ' + this.apiService.handleError(error));
        }
      });
    }
  }

  /**
   * Navigates to add address page
   */
  addAddress(): void {
    this.router.navigate(['/addresses/add']);
  }

  /**
   * Exports addresses data to CSV
   */
  exportAddresses(): void {
    const csvContent = this.generateCSV(this.filteredAddresses);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `addresses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Generates CSV content from addresses array
   * @param addresses - Array of addresses to export
   * @returns CSV string
   */
  private generateCSV(addresses: Address[]): string {
    const headers = ['ID', 'Street', 'Ward', 'District', 'Province', 'Postal Code', 'Service Area', 'Delivery Fee', 'Estimated Days'];
    const rows = addresses.map(addr => [
      addr.id,
      addr.street,
      addr.ward,
      addr.district,
      addr.province,
      addr.postalCode,
      addr.isServiceArea ? 'Yes' : 'No',
      addr.deliveryFee,
      addr.estimatedDays
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  }

  /**
   * Views province details
   * @param province - The province to view
   */
  viewProvince(province: Province): void {
    this.router.navigate(['/addresses/provinces', province.id]);
  }

  /**
   * Edits province details
   * @param province - The province to edit
   */
  editProvince(province: Province): void {
    this.router.navigate(['/addresses/provinces', province.id, 'edit']);
  }

  /**
   * Views district details
   * @param district - The district to view
   */
  viewDistrict(district: District): void {
    this.router.navigate(['/addresses/districts', district.id]);
  }

  /**
   * Edits district details
   * @param district - The district to edit
   */
  editDistrict(district: District): void {
    this.router.navigate(['/addresses/districts', district.id, 'edit']);
  }
}
