import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Seed Vietnam provinces, districts, and wards
  await seedVietnamAddresses()
  
  // Seed products
  await seedProducts()
  
  // Seed suppliers
  await seedSuppliers()
  
  // Seed users
  await seedUsers()
  
  // Seed orders
  await seedOrders()

  console.log('✅ Database seeding completed!')
}

async function seedVietnamAddresses() {
  console.log('📍 Seeding Vietnam addresses...')

  // Major provinces in Vietnam
  const provinces = [
    { code: '01', name: 'Thành phố Hà Nội', type: 'Thành phố Trung ương' },
    { code: '79', name: 'Thành phố Hồ Chí Minh', type: 'Thành phố Trung ương' },
    { code: '48', name: 'Thành phố Đà Nẵng', type: 'Thành phố Trung ương' },
    { code: '92', name: 'Thành phố Cần Thơ', type: 'Thành phố Trung ương' },
    { code: '31', name: 'Thành phố Hải Phòng', type: 'Thành phố Trung ương' },
    { code: '56', name: 'Tỉnh Khánh Hòa', type: 'Tỉnh' },
    { code: '77', name: 'Tỉnh Bà Rịa - Vũng Tàu', type: 'Tỉnh' },
    { code: '75', name: 'Tỉnh Đồng Nai', type: 'Tỉnh' },
    { code: '89', name: 'Tỉnh An Giang', type: 'Tỉnh' },
    { code: '87', name: 'Tỉnh Kiên Giang', type: 'Tỉnh' }
  ]

  for (const provinceData of provinces) {
    const province = await prisma.province.upsert({
      where: { code: provinceData.code },
      update: {},
      create: provinceData
    })

    // Create some districts for each province
    const districts = [
      { code: `${provinceData.code}01`, name: `Quận 1`, type: 'Quận' },
      { code: `${provinceData.code}02`, name: `Quận 2`, type: 'Quận' },
      { code: `${provinceData.code}03`, name: `Quận 3`, type: 'Quận' },
      { code: `${provinceData.code}04`, name: `Huyện 1`, type: 'Huyện' },
      { code: `${provinceData.code}05`, name: `Huyện 2`, type: 'Huyện' }
    ]

    for (const districtData of districts) {
      const district = await prisma.district.upsert({
        where: { code: districtData.code },
        update: {},
        create: {
          ...districtData,
          provinceId: province.id
        }
      })

      // Create some wards for each district
      const wards = [
        { code: `${districtData.code}01`, name: `Phường 1`, type: 'Phường' },
        { code: `${districtData.code}02`, name: `Phường 2`, type: 'Phường' },
        { code: `${districtData.code}03`, name: `Xã 1`, type: 'Xã' },
        { code: `${districtData.code}04`, name: `Xã 2`, type: 'Xã' }
      ]

      for (const wardData of wards) {
        await prisma.ward.upsert({
          where: { code: wardData.code },
          update: {},
          create: {
            ...wardData,
            districtId: district.id
          }
        })
      }
    }
  }

  console.log('✅ Vietnam addresses seeded')
}

async function seedProducts() {
  console.log('🎨 Seeding products...')

  const products = [
    {
      name: 'KOVA Premium Interior',
      brand: 'KOVA',
      category: 'Sơn Nội Thất',
      description: 'Sơn nội thất cao cấp, chống ẩm mốc, dễ lau chùi',
      basePrice: 750000,
      originalPrice: 850000,
      coverageRate: 12.0,
      unit: 'thùng 18L'
    },
    {
      name: 'KOVA Weathershield',
      brand: 'KOVA',
      category: 'Sơn Ngoại Thất',
      description: 'Sơn ngoại thất chống thấm, chống nắng, bền màu',
      basePrice: 850000,
      originalPrice: 950000,
      coverageRate: 10.0,
      unit: 'thùng 18L'
    },
    {
      name: 'Jotun Lady Interior',
      brand: 'Jotun',
      category: 'Sơn Nội Thất',
      description: 'Sơn nội thất thân thiện môi trường, không mùi',
      basePrice: 1100000,
      originalPrice: 1200000,
      coverageRate: 11.0,
      unit: 'thùng 18L'
    },
    {
      name: 'Jotun Weatherguard',
      brand: 'Jotun',
      category: 'Sơn Ngoại Thất',
      description: 'Sơn ngoại thất chống thấm cao cấp, bền màu lâu dài',
      basePrice: 1250000,
      originalPrice: 1350000,
      coverageRate: 9.0,
      unit: 'thùng 18L'
    },
    {
      name: 'Dulux Easycare Interior',
      brand: 'Dulux',
      category: 'Sơn Nội Thất',
      description: 'Sơn nội thất dễ lau chùi, chống bám bẩn',
      basePrice: 880000,
      originalPrice: 980000,
      coverageRate: 12.5,
      unit: 'thùng 18L'
    },
    {
      name: 'Dulux Weathershield Max',
      brand: 'Dulux',
      category: 'Sơn Ngoại Thất',
      description: 'Sơn ngoại thất chống thấm tối đa, bền màu',
      basePrice: 1050000,
      originalPrice: 1150000,
      coverageRate: 10.5,
      unit: 'thùng 18L'
    },
    {
      name: 'Nippon Odour-less',
      brand: 'Nippon',
      category: 'Sơn Nội Thất',
      description: 'Sơn nội thất không mùi, thân thiện môi trường',
      basePrice: 1000000,
      originalPrice: 1100000,
      coverageRate: 11.5,
      unit: 'thùng 18L'
    },
    {
      name: 'Nippon Weatherbond',
      brand: 'Nippon',
      category: 'Sơn Ngoại Thất',
      description: 'Sơn ngoại thất chống thấm, chống nắng',
      basePrice: 1150000,
      originalPrice: 1250000,
      coverageRate: 10.0,
      unit: 'thùng 18L'
    },
    {
      name: 'Maxilite Economy Interior',
      brand: 'Maxilite',
      category: 'Sơn Nội Thất',
      description: 'Sơn nội thất giá rẻ, chất lượng tốt',
      basePrice: 400000,
      originalPrice: 450000,
      coverageRate: 10.0,
      unit: 'thùng 18L'
    },
    {
      name: 'Maxilite Weatherproof',
      brand: 'Maxilite',
      category: 'Sơn Ngoại Thất',
      description: 'Sơn ngoại thất chống thấm cơ bản',
      basePrice: 500000,
      originalPrice: 550000,
      coverageRate: 9.0,
      unit: 'thùng 18L'
    }
  ]

  for (const productData of products) {
    try {
      await prisma.product.upsert({
        where: { name: productData.name },
        update: {},
        create: productData
      })
    } catch (error) {
      console.log(`Skipping product ${productData.name}: ${error}`)
    }
  }

  console.log('✅ Products seeded')
}

async function seedSuppliers() {
  console.log('🏢 Seeding suppliers...')

  const suppliers = [
    {
      name: 'Công ty TNHH Sơn KOVA',
      businessInfo: JSON.stringify({
        license: '0101234567',
        taxCode: '0101234567',
        website: 'https://kova.com.vn',
        description: 'Nhà sản xuất sơn hàng đầu Việt Nam với hơn 30 năm kinh nghiệm'
      }),
      contactInfo: JSON.stringify({
        email: 'contact@kova.com.vn',
        phone: '02812345678',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      }),
      isVerified: true
    },
    {
      name: 'Công ty CP Sơn Jotun Việt Nam',
      businessInfo: JSON.stringify({
        license: '0102345678',
        taxCode: '0102345678',
        website: 'https://jotun.com.vn',
        description: 'Thương hiệu sơn quốc tế uy tín, chuyên sơn công nghiệp và dân dụng'
      }),
      contactInfo: JSON.stringify({
        email: 'info@jotun.com.vn',
        phone: '02823456789',
        address: '456 Đường DEF, Quận 2, TP.HCM'
      }),
      isVerified: true
    },
    {
      name: 'Công ty TNHH Sơn Dulux Việt Nam',
      businessInfo: JSON.stringify({
        license: '0103456789',
        taxCode: '0103456789',
        website: 'https://dulux.com.vn',
        description: 'Thương hiệu sơn toàn cầu, đa dạng sản phẩm cho mọi nhu cầu'
      }),
      contactInfo: JSON.stringify({
        email: 'contact@dulux.com.vn',
        phone: '02834567890',
        address: '789 Đường GHI, Quận 3, TP.HCM'
      }),
      isVerified: true
    },
    {
      name: 'Công ty TNHH Sơn Nippon Việt Nam',
      businessInfo: JSON.stringify({
        license: '0104567890',
        taxCode: '0104567890',
        website: 'https://nipponpaint.com.vn',
        description: 'Sơn Nhật Bản chất lượng cao, công nghệ tiên tiến'
      }),
      contactInfo: JSON.stringify({
        email: 'info@nipponpaint.com.vn',
        phone: '02845678901',
        address: '321 Đường JKL, Quận 1, TP.HCM'
      }),
      isVerified: true
    },
    {
      name: 'Công ty TNHH Sơn Maxilite',
      businessInfo: JSON.stringify({
        license: '0105678901',
        taxCode: '0105678901',
        website: 'https://maxilite.com.vn',
        description: 'Sơn giá rẻ, chất lượng tốt cho thị trường đại chúng'
      }),
      contactInfo: JSON.stringify({
        email: 'contact@maxilite.com.vn',
        phone: '02856789012',
        address: '654 Đường MNO, Quận 2, TP.HCM'
      }),
      isVerified: false
    }
  ]

  for (const supplierData of suppliers) {
    await prisma.supplier.upsert({
      where: { name: supplierData.name },
      update: {},
      create: supplierData
    })
  }

  console.log('✅ Suppliers seeded')
}

async function seedUsers() {
  console.log('👥 Seeding users...')

  const users = [
    {
      email: 'admin@vncompare.com',
      name: 'Admin VNCompare',
      role: 'admin'
    },
    {
      email: 'customer1@example.com',
      name: 'Nguyễn Văn A',
      role: 'customer'
    },
    {
      email: 'customer2@example.com',
      name: 'Trần Thị B',
      role: 'customer'
    },
    {
      email: 'customer3@example.com',
      name: 'Lê Văn C',
      role: 'customer'
    },
    {
      email: 'customer4@example.com',
      name: 'Phạm Thị D',
      role: 'customer'
    }
  ]

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData
    })
  }

  console.log('✅ Users seeded')
}

async function seedOrders() {
  console.log('📦 Seeding orders...')

  // Get some products and suppliers
  const products = await prisma.product.findMany({ take: 5 })
  const suppliers = await prisma.supplier.findMany({ take: 3 })
  const users = await prisma.user.findMany({ where: { role: 'customer' } })

  if (products.length === 0 || suppliers.length === 0 || users.length === 0) {
    console.log('⚠️ Skipping orders seeding - missing required data')
    return
  }

  const orders = [
    {
      userId: users[0].id,
      productId: products[0].id,
      supplierId: suppliers[0].id,
      quantity: 2,
      totalPrice: products[0].basePrice! * 2,
      shippingAddress: JSON.stringify({
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM'
      }),
      status: 'completed'
    },
    {
      userId: users[1].id,
      productId: products[1].id,
      supplierId: suppliers[1].id,
      quantity: 1,
      totalPrice: products[1].basePrice! * 1,
      shippingAddress: JSON.stringify({
        name: 'Trần Thị B',
        phone: '0901234568',
        address: '456 Đường DEF, Phường 2, Quận 2, TP.HCM'
      }),
      status: 'pending'
    },
    {
      userId: users[2].id,
      productId: products[2].id,
      supplierId: suppliers[2].id,
      quantity: 3,
      totalPrice: products[2].basePrice! * 3,
      shippingAddress: JSON.stringify({
        name: 'Lê Văn C',
        phone: '0901234569',
        address: '789 Đường GHI, Phường 3, Quận 3, TP.HCM'
      }),
      status: 'shipped'
    }
  ]

  for (const orderData of orders) {
    await prisma.order.create({
      data: orderData
    })
  }

  console.log('✅ Orders seeded')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
