import { getDatabase } from '../src/lib/mongodb';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    const db = await getDatabase();

    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('suppliers').deleteMany({});
    await db.collection('provinces').deleteMany({});
    await db.collection('districts').deleteMany({});
    await db.collection('wards').deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await db.collection('users').insertOne({
      email: 'admin@vncompare.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+84901234567',
      role: 'admin',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });

    console.log('✅ Created admin user:', adminUser.insertedId);

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customer = await db.collection('users').insertOne({
      email: 'customer@example.com',
      password: customerPassword,
      name: 'John Doe',
      phone: '+84987654321',
      role: 'customer',
      createdAt: new Date(),
    });

    console.log('✅ Created customer user:', customer.insertedId);

    // Create sample products
    const products = [
      {
        name: 'Sơn Dulux Weathershield',
        brand: 'Dulux',
        category: 'Sơn ngoại thất',
        description: 'Sơn chống thấm cao cấp cho tường ngoài',
        basePrice: 450000,
        originalPrice: 500000,
        coverageRate: 12,
        unit: 'liter',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sơn Jotun Lady',
        brand: 'Jotun',
        category: 'Sơn nội thất',
        description: 'Sơn nội thất không mùi, thân thiện môi trường',
        basePrice: 380000,
        originalPrice: 420000,
        coverageRate: 14,
        unit: 'liter',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sơn Kova',
        brand: 'Kova',
        category: 'Sơn nội thất',
        description: 'Sơn nội thất chất lượng cao, giá cả hợp lý',
        basePrice: 320000,
        originalPrice: 350000,
        coverageRate: 13,
        unit: 'liter',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sơn Nippon Paint',
        brand: 'Nippon Paint',
        category: 'Sơn ngoại thất',
        description: 'Sơn ngoại thất chống UV, bền màu',
        basePrice: 520000,
        originalPrice: 580000,
        coverageRate: 11,
        unit: 'liter',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertedProducts = await db
      .collection('products')
      .insertMany(products);
    console.log('✅ Created products:', insertedProducts.insertedCount);

    // Create sample suppliers
    const suppliers = [
      {
        name: 'Công ty TNHH Sơn Việt',
        email: 'contact@sonviet.com',
        phone: '+84901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        businessInfo: {
          license: '0123456789',
          taxCode: '0123456789',
        },
        contactInfo: {
          contactPerson: 'Nguyễn Văn A',
          position: 'Giám đốc',
        },
        isVerified: true,
        createdAt: new Date(),
      },
      {
        name: 'Nhà phân phối Sơn Đông Á',
        email: 'info@sondonga.com',
        phone: '+84987654321',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        businessInfo: {
          license: '9876543210',
          taxCode: '9876543210',
        },
        contactInfo: {
          contactPerson: 'Trần Thị B',
          position: 'Trưởng phòng kinh doanh',
        },
        isVerified: true,
        createdAt: new Date(),
      },
      {
        name: 'Cửa hàng Vật liệu xây dựng Minh Tân',
        email: 'minhtan@example.com',
        phone: '+84912345678',
        address: '789 Đường DEF, Quận 3, TP.HCM',
        businessInfo: {
          license: '1122334455',
          taxCode: '1122334455',
        },
        contactInfo: {
          contactPerson: 'Lê Văn C',
          position: 'Chủ cửa hàng',
        },
        isVerified: false,
        createdAt: new Date(),
      },
    ];

    const insertedSuppliers = await db
      .collection('suppliers')
      .insertMany(suppliers);
    console.log('✅ Created suppliers:', insertedSuppliers.insertedCount);

    // Create sample provinces
    const provinces = [
      { code: '01', name: 'Thành phố Hà Nội', type: 'Thành phố Trung ương' },
      {
        code: '79',
        name: 'Thành phố Hồ Chí Minh',
        type: 'Thành phố Trung ương',
      },
      { code: '31', name: 'Tỉnh Hải Phòng', type: 'Tỉnh' },
      { code: '48', name: 'Tỉnh Đà Nẵng', type: 'Thành phố Trung ương' },
      { code: '92', name: 'Tỉnh Cần Thơ', type: 'Thành phố Trung ương' },
    ];

    const insertedProvinces = await db
      .collection('provinces')
      .insertMany(provinces);
    console.log('✅ Created provinces:', insertedProvinces.insertedCount);

    // Create sample districts for HCMC
    const hcmcProvince = await db
      .collection('provinces')
      .findOne({ code: '79' });
    if (hcmcProvince) {
      const districts = [
        {
          provinceId: hcmcProvince._id,
          code: '760',
          name: 'Quận 1',
          type: 'Quận',
        },
        {
          provinceId: hcmcProvince._id,
          code: '761',
          name: 'Quận 2',
          type: 'Quận',
        },
        {
          provinceId: hcmcProvince._id,
          code: '762',
          name: 'Quận 3',
          type: 'Quận',
        },
        {
          provinceId: hcmcProvince._id,
          code: '763',
          name: 'Quận 4',
          type: 'Quận',
        },
        {
          provinceId: hcmcProvince._id,
          code: '764',
          name: 'Quận 5',
          type: 'Quận',
        },
      ];

      const insertedDistricts = await db
        .collection('districts')
        .insertMany(districts);
      console.log('✅ Created districts:', insertedDistricts.insertedCount);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample accounts created:');
    console.log('Admin: admin@vncompare.com / admin123');
    console.log('Customer: customer@example.com / customer123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
