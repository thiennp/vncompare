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

  // Full list of 63 Vietnamese provinces/cities with official 2-digit codes
  const provinces = [
    { code: '01', name: 'Thành phố Hà Nội', type: 'Thành phố Trung ương' },
    { code: '02', name: 'Tỉnh Hà Giang', type: 'Tỉnh' },
    { code: '04', name: 'Tỉnh Cao Bằng', type: 'Tỉnh' },
    { code: '06', name: 'Tỉnh Bắc Kạn', type: 'Tỉnh' },
    { code: '08', name: 'Tỉnh Tuyên Quang', type: 'Tỉnh' },
    { code: '10', name: 'Tỉnh Lào Cai', type: 'Tỉnh' },
    { code: '11', name: 'Tỉnh Điện Biên', type: 'Tỉnh' },
    { code: '12', name: 'Tỉnh Lai Châu', type: 'Tỉnh' },
    { code: '14', name: 'Tỉnh Sơn La', type: 'Tỉnh' },
    { code: '15', name: 'Tỉnh Yên Bái', type: 'Tỉnh' },
    { code: '17', name: 'Tỉnh Hòa Bình', type: 'Tỉnh' },
    { code: '19', name: 'Tỉnh Thái Nguyên', type: 'Tỉnh' },
    { code: '20', name: 'Tỉnh Lạng Sơn', type: 'Tỉnh' },
    { code: '22', name: 'Tỉnh Quảng Ninh', type: 'Tỉnh' },
    { code: '24', name: 'Tỉnh Bắc Giang', type: 'Tỉnh' },
    { code: '25', name: 'Tỉnh Phú Thọ', type: 'Tỉnh' },
    { code: '26', name: 'Tỉnh Vĩnh Phúc', type: 'Tỉnh' },
    { code: '27', name: 'Tỉnh Bắc Ninh', type: 'Tỉnh' },
    { code: '30', name: 'Tỉnh Hải Dương', type: 'Tỉnh' },
    { code: '31', name: 'Thành phố Hải Phòng', type: 'Thành phố Trung ương' },
    { code: '33', name: 'Tỉnh Hưng Yên', type: 'Tỉnh' },
    { code: '34', name: 'Tỉnh Thái Bình', type: 'Tỉnh' },
    { code: '35', name: 'Tỉnh Hà Nam', type: 'Tỉnh' },
    { code: '36', name: 'Tỉnh Nam Định', type: 'Tỉnh' },
    { code: '37', name: 'Tỉnh Ninh Bình', type: 'Tỉnh' },
    { code: '38', name: 'Tỉnh Thanh Hóa', type: 'Tỉnh' },
    { code: '40', name: 'Tỉnh Nghệ An', type: 'Tỉnh' },
    { code: '42', name: 'Tỉnh Hà Tĩnh', type: 'Tỉnh' },
    { code: '44', name: 'Tỉnh Quảng Bình', type: 'Tỉnh' },
    { code: '45', name: 'Tỉnh Quảng Trị', type: 'Tỉnh' },
    { code: '46', name: 'Tỉnh Thừa Thiên Huế', type: 'Tỉnh' },
    { code: '48', name: 'Thành phố Đà Nẵng', type: 'Thành phố Trung ương' },
    { code: '49', name: 'Tỉnh Quảng Nam', type: 'Tỉnh' },
    { code: '51', name: 'Tỉnh Quảng Ngãi', type: 'Tỉnh' },
    { code: '52', name: 'Tỉnh Bình Định', type: 'Tỉnh' },
    { code: '54', name: 'Tỉnh Phú Yên', type: 'Tỉnh' },
    { code: '56', name: 'Tỉnh Khánh Hòa', type: 'Tỉnh' },
    { code: '58', name: 'Tỉnh Ninh Thuận', type: 'Tỉnh' },
    { code: '60', name: 'Tỉnh Bình Thuận', type: 'Tỉnh' },
    { code: '62', name: 'Tỉnh Kon Tum', type: 'Tỉnh' },
    { code: '64', name: 'Tỉnh Gia Lai', type: 'Tỉnh' },
    { code: '66', name: 'Tỉnh Đắk Lắk', type: 'Tỉnh' },
    { code: '67', name: 'Tỉnh Đắk Nông', type: 'Tỉnh' },
    { code: '68', name: 'Tỉnh Lâm Đồng', type: 'Tỉnh' },
    { code: '70', name: 'Tỉnh Bình Phước', type: 'Tỉnh' },
    { code: '72', name: 'Tỉnh Tây Ninh', type: 'Tỉnh' },
    { code: '74', name: 'Tỉnh Bình Dương', type: 'Tỉnh' },
    { code: '75', name: 'Tỉnh Đồng Nai', type: 'Tỉnh' },
    { code: '77', name: 'Tỉnh Bà Rịa - Vũng Tàu', type: 'Tỉnh' },
    { code: '79', name: 'Thành phố Hồ Chí Minh', type: 'Thành phố Trung ương' },
    { code: '80', name: 'Tỉnh Long An', type: 'Tỉnh' },
    { code: '82', name: 'Tỉnh Tiền Giang', type: 'Tỉnh' },
    { code: '83', name: 'Tỉnh Bến Tre', type: 'Tỉnh' },
    { code: '84', name: 'Tỉnh Trà Vinh', type: 'Tỉnh' },
    { code: '86', name: 'Tỉnh Vĩnh Long', type: 'Tỉnh' },
    { code: '87', name: 'Tỉnh Đồng Tháp', type: 'Tỉnh' },
    { code: '89', name: 'Tỉnh An Giang', type: 'Tỉnh' },
    { code: '91', name: 'Tỉnh Kiên Giang', type: 'Tỉnh' },
    { code: '92', name: 'Thành phố Cần Thơ', type: 'Thành phố Trung ương' },
    { code: '93', name: 'Tỉnh Hậu Giang', type: 'Tỉnh' },
    { code: '94', name: 'Tỉnh Sóc Trăng', type: 'Tỉnh' },
    { code: '95', name: 'Tỉnh Bạc Liêu', type: 'Tỉnh' },
    { code: '96', name: 'Tỉnh Cà Mau', type: 'Tỉnh' }
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
    await prisma.product.upsert({
      where: { name: productData.name },
      update: {},
      create: productData
    })
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
        description: 'Nhà sản xuất sơn hàng đầu Việt Nam với hơn 30 năm kinh nghiệm, chuyên sản xuất sơn nước, sơn dầu và các sản phẩm bảo vệ bề mặt'
      }),
      contactInfo: JSON.stringify({
        email: 'contact@kova.com.vn',
        phone: '02812345678',
        address: '123 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM'
      }),
      isVerified: true
    },
    {
      name: 'Công ty TNHH Sơn Jotun Việt Nam',
      businessInfo: JSON.stringify({
        license: '0102345678',
        taxCode: '0102345678',
        website: 'https://jotun.com.vn',
        description: 'Thương hiệu sơn quốc tế uy tín từ Na Uy, chuyên sơn công nghiệp, sơn dân dụng và sơn bảo vệ kết cấu thép'
      }),
      contactInfo: JSON.stringify({
        email: 'info@jotun.com.vn',
        phone: '02823456789',
        address: '456 Đường Lê Văn Việt, Quận 9, TP.HCM'
      }),
      isVerified: true
    },
    {
      name: 'Công ty TNHH Sơn Dulux Việt Nam',
      businessInfo: JSON.stringify({
        license: '0103456789',
        taxCode: '0103456789',
        website: 'https://dulux.com.vn',
        description: 'Thương hiệu sơn toàn cầu của AkzoNobel, đa dạng sản phẩm sơn nội thất, ngoại thất và sơn chuyên dụng'
      }),
      contactInfo: JSON.stringify({
        email: 'contact@dulux.com.vn',
        phone: '02834567890',
        address: '789 Đường Võ Văn Tần, Quận 3, TP.HCM'
      }),
      isVerified: true
    },
    {
      name: 'Công ty TNHH Sơn Nippon Việt Nam',
      businessInfo: JSON.stringify({
        license: '0104567890',
        taxCode: '0104567890',
        website: 'https://nipponpaint.com.vn',
        description: 'Thương hiệu sơn Nhật Bản chất lượng cao, công nghệ tiên tiến, chuyên sơn nước và sơn chống thấm'
      }),
      contactInfo: JSON.stringify({
        email: 'info@nipponpaint.com.vn',
        phone: '02845678901',
        address: '321 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM'
      }),
      isVerified: true
    },
    {
      name: 'Công ty TNHH Sơn Maxilite',
      businessInfo: JSON.stringify({
        license: '0105678901',
        taxCode: '0105678901',
        website: 'https://maxilite.com.vn',
        description: 'Nhà sản xuất sơn giá rẻ, chất lượng tốt cho thị trường đại chúng, chuyên sơn nước và sơn dầu'
      }),
      contactInfo: JSON.stringify({
        email: 'contact@maxilite.com.vn',
        phone: '02856789012',
        address: '654 Đường Cộng Hòa, Quận Tân Bình, TP.HCM'
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
      totalAmount: products[0].basePrice! * 2,
      shippingAddress: JSON.stringify({
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM'
      }),
      status: 'completed',
      paymentStatus: 'paid'
    },
    {
      userId: users[1].id,
      totalAmount: products[1].basePrice! * 1,
      shippingAddress: JSON.stringify({
        name: 'Trần Thị B',
        phone: '0901234568',
        address: '456 Đường DEF, Phường 2, Quận 2, TP.HCM'
      }),
      status: 'pending',
      paymentStatus: 'pending'
    },
    {
      userId: users[2].id,
      totalAmount: products[2].basePrice! * 3,
      shippingAddress: JSON.stringify({
        name: 'Lê Văn C',
        phone: '0901234569',
        address: '789 Đường GHI, Phường 3, Quận 3, TP.HCM'
      }),
      status: 'shipped',
      paymentStatus: 'paid'
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
