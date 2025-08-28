# VNCompare.com - Backoffice Features Documentation

## 🏢 Provider Backoffice Overview

The VNCompare.com backoffice is an Angular-based admin panel that allows paint suppliers and providers to manage their products, pricing, shipping, and service areas.

## 📋 Core Features

### 1. Provider Registration & Onboarding
- **Company Registration**: Business information, tax codes, contact details
- **Service Area Setup**: Define provinces, districts, and wards where service is available
- **Documentation Upload**: Business licenses, certifications, insurance
- **Verification Process**: Manual review and approval by VNCompare team

### 2. Product Management

#### Product Information
- **Basic Details**: Name, brand, category, description
- **Specifications**: 
  - Paint type (Interior, Exterior, Specialty, Industrial, Decorative, Eco-friendly)
  - Coverage rate (m²/liter) - **Critical for calculations**
  - Drying time, VOC levels, durability ratings
  - Color options and availability
- **Images**: High-quality product photos, color swatches
- **Technical Data**: Safety data sheets, application instructions

#### Coverage Data Management
- **Coverage Rate**: Set m²/liter for different surfaces
  - Smooth walls: 12-15 m²/liter
  - Textured walls: 8-10 m²/liter
  - Ceilings: 10-12 m²/liter
  - Exterior surfaces: 8-12 m²/liter
- **Surface Type Factors**: Adjust coverage based on surface texture
- **Application Method**: Brush, roller, spray gun efficiency
- **Number of Coats**: Recommended coats for full coverage

### 3. Pricing Management

#### Base Pricing
- **Product Price**: Base price per unit (liter, gallon, kg)
- **Volume Discounts**: Tiered pricing for bulk purchases
- **Promotional Pricing**: Time-limited discounts and offers
- **Seasonal Pricing**: Adjust prices based on market demand

#### Price Calculation Components
```
Total Price = Base Price + Shipping Cost + Taxes + Additional Fees
```

### 4. Address & Service Area Management

#### Vietnam Address System
- **Provinces (Tỉnh/Thành phố)**: 63 provinces and cities
- **Districts (Quận/Huyện)**: Administrative districts within provinces
- **Wards (Phường/Xã)**: Sub-district level areas
- **Street Address**: Detailed street names and building numbers

#### Service Area Configuration
- **Primary Service Areas**: Full service with standard delivery
- **Extended Service Areas**: Additional delivery fees
- **Remote Areas**: Special handling and extended delivery times
- **Address Validation**: Google Maps API integration for accuracy

### 5. Shipping & Delivery Management

#### Shipping Zones
- **Zone 1**: Same district - 1-2 business days
- **Zone 2**: Same province - 2-3 business days  
- **Zone 3**: Adjacent provinces - 3-5 business days
- **Zone 4**: Remote provinces - 5-7 business days

#### Shipping Cost Calculation
```
Base Shipping Cost = Zone Rate + Weight Factor + Distance Factor
```

**Zone Rates (VND)**:
- Zone 1: 30,000 - 50,000
- Zone 2: 50,000 - 80,000
- Zone 3: 80,000 - 120,000
- Zone 4: 120,000 - 200,000

**Weight Factors**:
- 1-5 liters: +0 VND
- 6-10 liters: +20,000 VND
- 11-20 liters: +40,000 VND
- 20+ liters: +60,000 VND

#### Delivery Timeframes
- **Standard Delivery**: 1-7 business days based on zone
- **Express Delivery**: +50% cost, 1-3 business days
- **Same Day Delivery**: +100% cost, same day (limited areas)
- **Weekend Delivery**: +30,000 VND surcharge

### 6. Coverage Calculator Integration

#### Coverage Calculation Formula
```
Paint Needed (liters) = Total Area (m²) ÷ Coverage Rate (m²/liter) × Number of Coats
```

#### Room Coverage Examples
- **Living Room (20m²)**: 20 ÷ 12 × 2 = 3.33 liters
- **Bedroom (15m²)**: 15 ÷ 12 × 2 = 2.5 liters
- **Kitchen (12m²)**: 12 ÷ 10 × 2 = 2.4 liters (textured walls)

#### Project Cost Calculation
```
Total Project Cost = Paint Cost + Shipping Cost + Labor Cost (optional)
```

### 7. Inventory Management

#### Stock Levels
- **Available Stock**: Current inventory quantities
- **Low Stock Alerts**: Automatic notifications when stock is low
- **Out of Stock Handling**: Backorder options or alternative products
- **Seasonal Stock Planning**: Forecast demand and adjust inventory

#### Warehouse Management
- **Multiple Locations**: Manage inventory across different warehouses
- **Location-based Pricing**: Different prices for different regions
- **Cross-location Transfers**: Move inventory between locations

### 8. Analytics & Reporting

#### Sales Analytics
- **Product Performance**: Best-selling products and categories
- **Geographic Analysis**: Sales by province, district, ward
- **Customer Insights**: Purchase patterns and preferences
- **Revenue Tracking**: Daily, weekly, monthly revenue reports

#### Operational Metrics
- **Delivery Performance**: On-time delivery rates
- **Customer Satisfaction**: Ratings and feedback analysis
- **Inventory Turnover**: Stock movement and efficiency
- **Profit Margins**: Product and service profitability

## 🔧 Technical Implementation

### Angular Backoffice Structure
```
apps/admin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── product-management/
│   │   │   ├── pricing-management/
│   │   │   ├── shipping-management/
│   │   │   ├── address-management/
│   │   │   └── analytics/
│   │   ├── services/
│   │   │   ├── product.service.ts
│   │   │   ├── pricing.service.ts
│   │   │   ├── shipping.service.ts
│   │   │   └── address.service.ts
│   │   ├── models/
│   │   │   ├── product.model.ts
│   │   │   ├── address.model.ts
│   │   │   └── shipping.model.ts
│   │   └── store/
│   │       ├── actions/
│   │       ├── reducers/
│   │       └── effects/
│   └── assets/
└── package.json
```

### Database Schema Extensions

#### Address Management
```sql
-- Vietnam Address Database
CREATE TABLE provinces (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE,
  name VARCHAR(100),
  type VARCHAR(20) -- 'Tỉnh' or 'Thành phố'
);

CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  province_id INTEGER REFERENCES provinces(id),
  code VARCHAR(10) UNIQUE,
  name VARCHAR(100),
  type VARCHAR(20) -- 'Quận' or 'Huyện'
);

CREATE TABLE wards (
  id SERIAL PRIMARY KEY,
  district_id INTEGER REFERENCES districts(id),
  code VARCHAR(10) UNIQUE,
  name VARCHAR(100),
  type VARCHAR(20) -- 'Phường' or 'Xã'
);
```

#### Shipping Configuration
```sql
CREATE TABLE shipping_zones (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id),
  zone_name VARCHAR(50),
  base_rate DECIMAL(10,2),
  weight_factor DECIMAL(10,2),
  distance_factor DECIMAL(10,2),
  delivery_days INTEGER,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE service_areas (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id),
  province_id INTEGER REFERENCES provinces(id),
  district_id INTEGER REFERENCES districts(id),
  ward_id INTEGER REFERENCES wards(id),
  shipping_zone_id INTEGER REFERENCES shipping_zones(id),
  delivery_fee DECIMAL(10,2),
  delivery_days INTEGER
);
```

#### Coverage Data
```sql
CREATE TABLE product_coverage (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  surface_type VARCHAR(50), -- 'smooth', 'textured', 'ceiling', 'exterior'
  coverage_rate DECIMAL(8,2), -- m²/liter
  coats_required INTEGER DEFAULT 2,
  notes TEXT
);
```

### API Endpoints

#### Product Management
```
POST   /api/admin/products
GET    /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
POST   /api/admin/products/:id/coverage
```

#### Address Management
```
GET    /api/admin/addresses/provinces
GET    /api/admin/addresses/districts/:provinceId
GET    /api/admin/addresses/wards/:districtId
POST   /api/admin/addresses/validate
```

#### Shipping Management
```
POST   /api/admin/shipping/zones
GET    /api/admin/shipping/calculate
POST   /api/admin/shipping/service-areas
```

#### Pricing Management
```
POST   /api/admin/pricing/calculate
PUT    /api/admin/pricing/products/:id
POST   /api/admin/pricing/promotions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI 17+
- PostgreSQL 14+
- Google Maps API key

### Installation
```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Navigate to admin app
cd apps/admin

# Install dependencies
npm install

# Start development server
ng serve
```

### Environment Configuration
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleMapsApiKey: 'your-google-maps-api-key',
  appName: 'VNCompare Admin'
};
```

## 📊 Data Flow

### Coverage Calculation Flow
1. **Provider Input**: Set coverage rates (m²/liter) for different surfaces
2. **User Input**: Enter room dimensions and surface types
3. **Calculation**: System calculates paint needed using coverage formula
4. **Pricing**: Apply product price to calculated quantity
5. **Shipping**: Calculate shipping based on address and weight
6. **Total**: Display total cost including all components

### Address Management Flow
1. **Address Input**: User enters address or selects from dropdown
2. **Validation**: Google Maps API validates and standardizes address
3. **Service Check**: System checks if address is in provider's service area
4. **Shipping Calculation**: Determine shipping zone and costs
5. **Delivery Estimate**: Calculate delivery timeframe

## 🔒 Security & Permissions

### Provider Authentication
- **JWT-based authentication**
- **Role-based access control**
- **Two-factor authentication (optional)**
- **Session management**

### Data Validation
- **Input sanitization**
- **Address validation**
- **Price range validation**
- **Coverage rate validation**

### Audit Trail
- **All changes logged**
- **User action tracking**
- **Price change history**
- **Inventory movement logs**

## 📱 User Interface Features

### Dashboard
- **Overview metrics**
- **Recent orders**
- **Low stock alerts**
- **Performance charts**

### Product Management
- **Bulk import/export**
- **Image upload with optimization**
- **Category management**
- **Pricing templates**

### Address Management
- **Interactive map interface**
- **Address autocomplete**
- **Service area visualization**
- **Zone configuration**

### Analytics
- **Real-time sales data**
- **Geographic heat maps**
- **Customer behavior analysis**
- **Competitive pricing insights**

This comprehensive backoffice system empowers providers to efficiently manage their products, pricing, and delivery services while providing customers with accurate cost calculations and delivery estimates.
