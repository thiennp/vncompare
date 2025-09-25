import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Calculate real metrics from database
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalSuppliers,
      totalReviews,
      recentOrders,
      topProducts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.supplier.count(),
      prisma.review.count(),
      prisma.order.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.product.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      })
    ])

    // Calculate total revenue from orders
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    })
    const totalRevenue = revenueResult._sum.totalAmount || 0

    // Calculate pending suppliers (unverified)
    const pendingSuppliers = await prisma.supplier.count({
      where: { isVerified: false }
    })

    // Calculate low stock products (since we don't have a stock field, return 0)
    const lowStockProducts = 0

    // Transform recent orders data
    const recentOrdersData = recentOrders.map(order => ({
      id: order.id.toString(),
      customerName: order.user?.name || 'Unknown',
      totalAmount: parseFloat(order.totalAmount.toString()),
      status: order.status,
      createdAt: order.createdAt.toISOString()
    }))

    // Transform top products data
    const topProductsData = topProducts.map(product => ({
      id: product.id.toString(),
      name: product.name,
      sales: 0, // Would be calculated from order items in a full implementation
      revenue: 0 // Would be calculated from order items in a full implementation
    }))

    return NextResponse.json({
      success: true,
      message: 'Dashboard metrics retrieved successfully',
      data: {
        totalRevenue: parseFloat(totalRevenue.toString()),
        totalOrders,
        totalProducts,
        totalUsers,
        totalSuppliers,
        totalReviews,
        revenueGrowth: 0, // Would need historical data to calculate
        ordersGrowth: 0, // Would need historical data to calculate
        productsGrowth: 0, // Would need historical data to calculate
        usersGrowth: 0, // Would need historical data to calculate
        pendingReviews: 0, // Would need status tracking to calculate
        lowStockProducts,
        pendingSuppliers,
        recentOrders: recentOrdersData,
        topProducts: topProductsData
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch dashboard metrics',
        details: error instanceof Error ? [error.message] : ['Unknown error']
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    }, { status: 500 })
  }
}
