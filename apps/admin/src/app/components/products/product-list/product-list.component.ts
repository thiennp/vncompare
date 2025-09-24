import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../models/product.model';
import { ApiService } from '../../../services/api.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

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
    private apiService: ApiService,
    private snackBar: MatSnackBar
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
    // Open add product dialog
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: Product): void {
    // Open edit product dialog
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { mode: 'edit', product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(product: Product): void {
    // Show confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xóa sản phẩm',
        message: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.snackBar.open('Sản phẩm đã được xóa', 'Đóng', { duration: 3000 });
            this.loadProducts();
          },
          error: (error) => {
            this.snackBar.open('Lỗi khi xóa sản phẩm', 'Đóng', { duration: 3000 });
            console.error('Delete error:', error);
          }
        });
      }
    });
  }

  toggleProductStatus(product: Product): void {
    const newStatus = !product.isActive;
    product.isActive = newStatus;
    
    // Update via API
    this.productService.updateProductStatus(product.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open(
          `Sản phẩm đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'}`,
          'Đóng',
          { duration: 3000 }
        );
      },
      error: (error) => {
        // Revert the change on error
        product.isActive = !newStatus;
        this.snackBar.open('Lỗi khi cập nhật trạng thái sản phẩm', 'Đóng', { duration: 3000 });
        console.error('Toggle status error:', error);
      }
    });
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'green' : 'red';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  }
}
