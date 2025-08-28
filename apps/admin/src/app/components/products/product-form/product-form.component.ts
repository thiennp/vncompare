import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  categories = [
    'Sơn nội thất',
    'Sơn ngoại thất', 
    'Sơn chống thấm',
    'Sơn chống cháy',
    'Sơn lót',
    'Sơn trang trí'
  ];

  brands = [
    'Dulux',
    'Jotun',
    'Nippon',
    'TOA',
    'Sika',
    'AkzoNobel',
    'PPG',
    'Sherwin-Williams'
  ];

  units = ['lít', 'kg', 'm²'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product }
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      basePrice: ['', [Validators.required, Validators.min(0)]],
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      coverageRate: ['', [Validators.required, Validators.min(0.1)]],
      unit: ['lít', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.data?.product) {
      this.isEditMode = true;
      this.productForm.patchValue(this.data.product);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.isEditMode) {
        productData.id = this.data.product?.id;
        productData.updatedAt = new Date();
      } else {
        productData.createdAt = new Date();
        productData.updatedAt = new Date();
      }

      this.dialogRef.close(productData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Trường này là bắt buộc';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Tối thiểu ${requiredLength} ký tự`;
    }
    if (control?.hasError('min')) {
      return 'Giá trị phải lớn hơn 0';
    }
    return '';
  }

  calculateSavings(): number {
    const basePrice = this.productForm.get('basePrice')?.value || 0;
    const originalPrice = this.productForm.get('originalPrice')?.value || 0;
    
    if (originalPrice > 0) {
      return ((originalPrice - basePrice) / originalPrice) * 100;
    }
    return 0;
  }
}
