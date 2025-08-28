import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../models/product.model';

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

  products: Product[] = [
    {
      id: 1,
      name: 'Sơn Dulux Nội Thất',
      brand: 'Dulux',
      category: 'Sơn nội thất',
      description: 'Sơn nội thất chất lượng cao',
      basePrice: 850000,
      originalPrice: 950000,
      coverageRate: 12.5,
      unit: 'lít',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Sơn Jotun Ngoại Thất',
      brand: 'Jotun',
      category: 'Sơn ngoại thất',
      description: 'Sơn ngoại thất chống thấm',
      basePrice: 1200000,
      originalPrice: 1350000,
      coverageRate: 10.0,
      unit: 'lít',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Sơn Nippon Chống Thấm',
      brand: 'Nippon',
      category: 'Sơn chống thấm',
      description: 'Sơn chống thấm hiệu quả',
      basePrice: 950000,
      originalPrice: 1100000,
      coverageRate: 8.5,
      unit: 'lít',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    // TODO: Load from API
    this.dataSource.data = this.products;
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
