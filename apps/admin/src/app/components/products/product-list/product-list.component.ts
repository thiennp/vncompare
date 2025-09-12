import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../models/product.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'brand', 'category', 'basePrice', 'coverageRate', 'isActive', 'actions'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getProducts({ limit: 100 }).subscribe({
      next: (response) => {
        this.products = response.products.map(product => ({
          id: parseInt(product.id),
          name: product.name,
          brand: product.brand,
          category: product.category?.name || 'N/A',
          description: product.description,
          basePrice: product.currentPrice,
          originalPrice: product.price,
          coverageRate: product.coverage,
          unit: 'lít',
          isActive: product.isActive,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        }));
        this.dataSource.data = this.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.error = 'Không thể tải danh sách sản phẩm';
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addProduct(): void {
    // TODO: Open add product dialog
    console.log('Add product');
  }

  editProduct(product: Product): void {
    // TODO: Open edit product dialog
    console.log('Edit product:', product);
  }

  deleteProduct(product: Product): void {
    // TODO: Show confirmation dialog
    console.log('Delete product:', product);
  }

  toggleProductStatus(product: Product): void {
    product.isActive = !product.isActive;
    // TODO: Update via API
    console.log('Toggle product status:', product);
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'green' : 'red';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  }
}
