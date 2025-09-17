# Create New Component - VNCompare.com

## 🎯 Context
You are working on VNCompare.com, a paint comparison platform for Vietnam. Before creating any new component, you MUST:

1. **Read `AI_PROJECT_CONTEXT.md`** to understand the project structure
2. **Identify which app** you're working on (web, admin, backoffice)
3. **Follow established patterns** and conventions

## 📋 Component Creation Checklist

### 1. Determine Application Type

#### Next.js Web App (`apps/web/`)
- **Location**: `apps/web/src/components/`
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Radix UI
- **State**: Zustand + TanStack Query
- **Language**: TypeScript

#### Angular Admin (`apps/admin/`)
- **Location**: `apps/admin/src/app/components/`
- **Framework**: Angular 17
- **Styling**: Angular Material + Tailwind CSS
- **State**: NgRx
- **Language**: TypeScript

#### Angular Backoffice (`apps/backoffice/`)
- **Location**: `apps/backoffice/src/app/components/`
- **Framework**: Angular 20
- **Styling**: Angular Material
- **Language**: TypeScript

### 2. Component Structure

#### Next.js Component
```typescript
// components/NewComponent.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NewComponentProps {
  // Define props
}

export function NewComponent({ ...props }: NewComponentProps) {
  // Component logic
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
}
```

#### Angular Component
```typescript
// components/new-component/new-component.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-new-component',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './new-component.component.html',
  styleUrls: ['./new-component.component.scss']
})
export class NewComponentComponent {
  @Input() data: any;
  @Output() action = new EventEmitter<any>();

  // Component logic
}
```

### 3. Business Logic Considerations

#### Paint-Specific Features
- **Coverage Calculator**: Include paint quantity calculations
- **Price Display**: Show VND currency formatting
- **Address Input**: Use Vietnam address system
- **Color Picker**: Support paint color selection
- **Supplier Info**: Display supplier ratings and info

#### Vietnam-Specific Features
- **Address Validation**: Provinces, districts, wards
- **Phone Format**: Vietnamese phone number validation
- **Currency**: VND formatting with proper symbols
- **Language**: Vietnamese text support

### 4. Styling Guidelines

#### Next.js (Tailwind CSS)
```typescript
// Use Tailwind classes with Radix UI components
<div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">
    Component Title
  </h2>
  <p className="text-gray-600">
    Component description
  </p>
</div>
```

#### Angular (Material + Tailwind)
```html
<!-- Use Angular Material with Tailwind utilities -->
<mat-card class="p-6 shadow-md">
  <mat-card-header>
    <mat-card-title class="text-xl font-semibold">
      Component Title
    </mat-card-title>
  </mat-card-header>
  <mat-card-content class="text-gray-600">
    Component content
  </mat-card-content>
</mat-card>
```

### 5. State Management

#### Next.js (Zustand + TanStack Query)
```typescript
// Store
import { create } from 'zustand';

interface ComponentStore {
  data: any[];
  loading: boolean;
  setData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useComponentStore = create<ComponentStore>((set) => ({
  data: [],
  loading: false,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));

// Query
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['component-data'],
  queryFn: fetchComponentData,
});
```

#### Angular (NgRx)
```typescript
// Actions
export const loadData = createAction('[Component] Load Data');
export const loadDataSuccess = createAction(
  '[Component] Load Data Success',
  props<{ data: any[] }>()
);

// Reducer
export const componentReducer = createReducer(
  initialState,
  on(loadData, (state) => ({ ...state, loading: true })),
  on(loadDataSuccess, (state, { data }) => ({ ...state, data, loading: false }))
);
```

### 6. Testing Requirements

#### Next.js Testing
```typescript
// __tests__/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from '../NewComponent';

describe('NewComponent', () => {
  it('renders correctly', () => {
    render(<NewComponent />);
    expect(screen.getByText('Component Title')).toBeInTheDocument();
  });
});
```

#### Angular Testing
```typescript
// new-component.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewComponentComponent } from './new-component.component';

describe('NewComponentComponent', () => {
  let component: NewComponentComponent;
  let fixture: ComponentFixture<NewComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewComponentComponent]
    });
    fixture = TestBed.createComponent(NewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 7. Accessibility Guidelines

#### ARIA Labels
```html
<!-- Add proper ARIA labels -->
<button aria-label="Add to cart">
  <ShoppingCartIcon />
</button>

<!-- Form labels -->
<label htmlFor="paint-color">Paint Color</label>
<input id="paint-color" type="text" />
```

#### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Use proper tab order
- Add focus indicators
- Support keyboard shortcuts where appropriate

### 8. Performance Considerations

#### Next.js
- Use `React.memo` for expensive components
- Implement proper loading states
- Use dynamic imports for code splitting
- Optimize images with Next.js Image component

#### Angular
- Use OnPush change detection strategy
- Implement trackBy functions for *ngFor
- Use async pipe for observables
- Lazy load components when possible

### 9. Common Component Types

#### Paint Product Card
```typescript
interface PaintProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    coverage: number; // m²/liter
    color: string;
    rating: number;
    image: string;
  };
  onAddToCart: (product: Product) => void;
}
```

#### Coverage Calculator
```typescript
interface CoverageCalculatorProps {
  roomDimensions: {
    length: number;
    width: number;
    height: number;
  };
  paintCoverage: number; // m²/liter
  coats: number;
  onCalculate: (result: CoverageResult) => void;
}
```

#### Address Input (Vietnam)
```typescript
interface AddressInputProps {
  value: Address;
  onChange: (address: Address) => void;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
}
```

### 10. File Organization

#### Next.js Structure
```
components/
├── ui/                    # Reusable UI components
├── forms/                 # Form components
├── layout/                # Layout components
├── paint/                 # Paint-specific components
└── common/                # Common components
```

#### Angular Structure
```
components/
├── shared/                # Shared components
├── paint/                 # Paint-specific components
├── forms/                 # Form components
└── layout/                # Layout components
```

## 🚨 Important Reminders

1. **Always read `AI_PROJECT_CONTEXT.md` first**
2. **Choose the correct application** (web, admin, backoffice)
3. **Follow established patterns** and conventions
4. **Consider Vietnam-specific requirements**
5. **Test accessibility and performance**
6. **Use proper TypeScript types**
7. **Implement proper error handling**
8. **Add comprehensive tests**

## 📚 Reference Files

- `AI_PROJECT_CONTEXT.md`: Project overview and architecture
- `apps/web/src/components/`: Next.js components
- `apps/admin/src/app/components/`: Angular admin components
- `apps/backoffice/src/app/components/`: Angular backoffice components

---

**Remember**: This is a Vietnam-specific paint comparison platform. Always consider the local market requirements, address system, and business logic when creating new components.
