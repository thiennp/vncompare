import { PrismaClient } from '@prisma/client'
import {
  getProvinces,
  getDistricts,
  getWards,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode
} from 'sub-vn'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Seed Vietnam provinces, districts, and wards
  await seedVietnamAddresses()
  
  // Seed products
  try {
    await seedProducts()
  } catch (e: any) {
    console.warn('⚠️ Skipping products seeding:', e?.message ?? e)
  }
  
  // Seed suppliers
  try {
    await seedSuppliers()
  } catch (e: any) {
    console.warn('⚠️ Skipping suppliers seeding:', e?.message ?? e)
  }
  
  // Seed users
  try {
    await seedUsers()
  } catch (e: any) {
    console.warn('⚠️ Skipping users seeding:', e?.message ?? e)
  }
  
  // Seed orders
  try {
    await seedOrders()
  } catch (e: any) {
    console.warn('⚠️ Skipping orders seeding:', e?.message ?? e)
  }

  console.log('✅ Database seeding completed!')
}

async function seedVietnamAddresses() {
  console.log('📍 Seeding Vietnam addresses from sub-vn dataset...')

  const provinceCodeToId = new Map<string, number>()

  const provinces = getProvinces()
  for (const p of provinces) {
    const code = String(p.code)
    const type = p.type === 'thanh-pho' ? 'Thành phố Trung ương' : 'Tỉnh'
    const created = await prisma.province.upsert({
      where: { code },
      update: { name: p.name, type },
      create: { code, name: p.name, type }
    })
    provinceCodeToId.set(code, created.id)
  }

  const districtCodeToId = new Map<string, number>()
  for (const p of provinces) {
    const provinceId = provinceCodeToId.get(String(p.code))
    if (!provinceId) continue
    const districts = getDistrictsByProvinceCode(p.code)
    for (const d of districts) {
      const code = String(d.code)
      const type = d.type === 'quan' ? 'Quận' : d.type === 'thi-xa' ? 'Thị xã' : d.type === 'thanh-pho' ? 'Thành phố' : 'Huyện'
      const created = await prisma.district.upsert({
        where: { code },
        update: { name: d.name, type, provinceId },
        create: { code, name: d.name, type, provinceId }
      })
      districtCodeToId.set(code, created.id)
    }
  }

  for (const [districtCode, districtId] of districtCodeToId.entries()) {
    const wards = getWardsByDistrictCode(districtCode)
    for (const w of wards) {
      const code = String(w.code)
      const type = w.type === 'phuong' ? 'Phường' : w.type === 'thi-tran' ? 'Thị trấn' : 'Xã'
      await prisma.ward.upsert({
        where: { code },
        update: { name: w.name, type, districtId },
        create: { code, name: w.name, type, districtId }
      })
    }
  }

  const [pCount, dCount, wCount] = await Promise.all([
    prisma.province.count(),
    prisma.district.count(),
    prisma.ward.count()
  ])
  console.log(`✅ Vietnam addresses seeded. Provinces: ${pCount}, Districts: ${dCount}, Wards: ${wCount}`)
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
