# Database Setup Guide for VNCompare.com

## 🗄️ Database Configuration

### 1. Get Your DATABASE_URL

**Option A: Supabase (Recommended)**

1. Go to [supabase.com](https://supabase.com)
2. Create new project: `vncompare`
3. Copy connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

**Option B: Railway**

1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string from database settings

### 2. Environment Variables

Create `.env.local` in `apps/web/` with:

```env
# Database
DATABASE_URL="your-supabase-connection-string"
DIRECT_URL="your-supabase-connection-string"

# Authentication
NEXTAUTH_URL="https://vncompare.com"
NEXTAUTH_SECRET="generate-a-32-character-secret"

# For development, you can use:
# NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Schema

The database will include these tables:

```sql
-- Users and Authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vietnam Address System
CREATE TABLE provinces (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE,
  name VARCHAR(100),
  type VARCHAR(20)
);

CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  province_id INTEGER REFERENCES provinces(id),
  code VARCHAR(10) UNIQUE,
  name VARCHAR(100),
  type VARCHAR(20)
);

CREATE TABLE wards (
  id SERIAL PRIMARY KEY,
  district_id INTEGER REFERENCES districts(id),
  code VARCHAR(10) UNIQUE,
  name VARCHAR(100),
  type VARCHAR(20)
);

-- Products and Pricing
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(50),
  description TEXT,
  base_price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  coverage_rate DECIMAL(8,2), -- m²/liter
  unit VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_coverage (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  surface_type VARCHAR(50),
  coverage_rate DECIMAL(8,2),
  coats_required INTEGER DEFAULT 2,
  notes TEXT
);

-- Suppliers and Service Areas
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  business_info JSONB,
  contact_info JSONB,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shipping_zones (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id),
  zone_name VARCHAR(50),
  base_rate DECIMAL(10,2),
  weight_factor DECIMAL(10,2),
  distance_factor DECIMAL(10,2),
  delivery_days INTEGER,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE service_areas (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id),
  province_id INTEGER REFERENCES provinces(id),
  district_id INTEGER REFERENCES districts(id),
  ward_id INTEGER REFERENCES wards(id),
  shipping_zone_id INTEGER REFERENCES shipping_zones(id),
  delivery_fee DECIMAL(10,2),
  delivery_days INTEGER
);

-- Orders and Analytics
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  supplier_id INTEGER REFERENCES suppliers(id),
  quantity INTEGER,
  total_price DECIMAL(10,2),
  shipping_address JSONB,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Initialize Database

```bash
# Navigate to web app
cd apps/web

# Install Prisma CLI
npm install -g prisma

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View database in browser
npx prisma studio
```

### 5. Seed Data

Create `apps/web/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Vietnam provinces
  const provinces = [
    { code: '01', name: 'Hà Nội', type: 'Thành phố' },
    { code: '79', name: 'TP. Hồ Chí Minh', type: 'Thành phố' },
    { code: '48', name: 'Đà Nẵng', type: 'Thành phố' },
    // Add more provinces...
  ];

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { code: province.code },
      update: {},
      create: province,
    });
  }

  // Seed sample products
  const products = [
    {
      name: 'Dulux Nội Thất',
      brand: 'Dulux',
      category: 'interior',
      basePrice: 850000,
      originalPrice: 950000,
      coverageRate: 12.0,
      unit: 'liter',
    },
    // Add more products...
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 6. Run Seed

```bash
npx prisma db seed
```

## 🚀 Deployment Steps

1. **Set up Supabase database** (get DATABASE_URL)
2. **Create `.env.local`** with your database URL
3. **Run database migrations:** `npx prisma db push`
4. **Deploy to Vercel** with environment variables
5. **Configure custom domain:** vncompare.com

## 🔧 Troubleshooting

**Common Issues:**

- **Connection refused:** Check DATABASE_URL format
- **Permission denied:** Ensure database user has proper permissions
- **Schema not found:** Run `npx prisma db push` first

**Need Help?**

- Check Supabase logs in dashboard
- Verify connection string format
- Test connection with `npx prisma studio`
