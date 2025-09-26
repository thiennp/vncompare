import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/vncompare';

async function seedMongoDB() {
  let client: MongoClient;

  try {
    console.log('🌱 Seeding MongoDB database...');

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('vncompare');

    // Simple password hashing function
    const hashPassword = (password: string) => {
      return Buffer.from(
        password + 'your-super-secret-jwt-key-for-development-only'
      ).toString('base64');
    };

    // Create users collection and insert users
    const usersCollection = db.collection('users');

    // Check if admin user exists
    const existingAdmin = await usersCollection.findOne({
      email: 'nguyenphongthien@gmail.com',
    });
    if (!existingAdmin) {
      await usersCollection.insertOne({
        email: 'nguyenphongthien@gmail.com',
        password: hashPassword('Kimtuoc2'),
        name: 'Nguyen Phong Thien',
        phone: '0123456789',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      console.log('✅ Admin user created');
    } else {
      console.log('⚠️ Admin user already exists');
    }

    // Check if customer user exists
    const existingCustomer = await usersCollection.findOne({
      email: 'customer@example.com',
    });
    if (!existingCustomer) {
      await usersCollection.insertOne({
        email: 'customer@example.com',
        password: hashPassword('customer123'),
        name: 'Customer User',
        phone: '0987654321',
        role: 'customer',
        createdAt: new Date().toISOString(),
      });
      console.log('✅ Customer user created');
    } else {
      console.log('⚠️ Customer user already exists');
    }

    // Create products collection and insert products
    const productsCollection = db.collection('products');
    const products = [
      {
        name: 'Sơn Dulux Weathershield',
        brand: 'Dulux',
        category: 'exterior',
        description: 'Sơn ngoại thất chống thời tiết cao cấp',
        basePrice: 450000,
        originalPrice: 500000,
        unit: 'liter',
        coverage: 8,
        isActive: true,
        images: ['https://example.com/dulux-weathershield.jpg'],
        specifications: {
          color: 'Trắng',
          volume: '5L',
          durability: '5 năm',
        },
        createdAt: new Date().toISOString(),
      },
      {
        name: 'Sơn Jotun Lady',
        brand: 'Jotun',
        category: 'interior',
        description: 'Sơn nội thất cao cấp với công nghệ kháng khuẩn',
        basePrice: 380000,
        originalPrice: 420000,
        unit: 'liter',
        coverage: 10,
        isActive: true,
        images: ['https://example.com/jotun-lady.jpg'],
        specifications: {
          color: 'Trắng',
          volume: '4L',
          durability: '3 năm',
        },
        createdAt: new Date().toISOString(),
      },
      {
        name: 'Sơn Kova Premium',
        brand: 'Kova',
        category: 'interior',
        description: 'Sơn nội thất cao cấp với độ bóng cao',
        basePrice: 320000,
        originalPrice: 350000,
        unit: 'liter',
        coverage: 12,
        isActive: true,
        images: ['https://example.com/kova-premium.jpg'],
        specifications: {
          color: 'Trắng',
          volume: '3.6L',
          durability: '2 năm',
        },
        createdAt: new Date().toISOString(),
      },
    ];

    // Insert products (ignore duplicates)
    for (const product of products) {
      const existing = await productsCollection.findOne({ name: product.name });
      if (!existing) {
        await productsCollection.insertOne(product);
        console.log(`✅ Product created: ${product.name}`);
      } else {
        console.log(`⚠️ Product already exists: ${product.name}`);
      }
    }

    // Create suppliers collection and insert suppliers
    const suppliersCollection = db.collection('suppliers');
    const suppliers = [
      {
        name: 'Công ty TNHH Sơn Dulux Việt Nam',
        email: 'contact@dulux.vn',
        phone: '1900-1234',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        businessInfo: {
          taxCode: '0123456789',
          businessLicense: 'BL001',
        },
        contactInfo: {
          contactPerson: 'Nguyễn Văn A',
          phone: '0901234567',
        },
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: 'Jotun Vietnam Co., Ltd',
        email: 'info@jotun.vn',
        phone: '1900-5678',
        address: '456 Lê Lợi, Q1, TP.HCM',
        businessInfo: {
          taxCode: '0987654321',
          businessLicense: 'BL002',
        },
        contactInfo: {
          contactPerson: 'Trần Thị B',
          phone: '0907654321',
        },
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Insert suppliers (ignore duplicates)
    for (const supplier of suppliers) {
      const existing = await suppliersCollection.findOne({
        name: supplier.name,
      });
      if (!existing) {
        await suppliersCollection.insertOne(supplier);
        console.log(`✅ Supplier created: ${supplier.name}`);
      } else {
        console.log(`⚠️ Supplier already exists: ${supplier.name}`);
      }
    }

    console.log('');
    console.log('🎉 MongoDB seeding completed successfully!');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('📧 Email: nguyenphongthien@gmail.com');
    console.log('🔑 Password: Kimtuoc2');
    console.log('');
    console.log('👤 Customer Login Credentials:');
    console.log('📧 Email: customer@example.com');
    console.log('🔑 Password: customer123');
  } catch (error) {
    console.error('❌ Error seeding MongoDB:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
    }
  }
}

seedMongoDB();
