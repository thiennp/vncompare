import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { 
      province, 
      district, 
      ward, 
      products 
    } = await request.json();

    if (!province || !district || !ward || !products || !Array.isArray(products)) {
      return NextResponse.json(
        { success: false, message: 'Province, district, ward, and products are required' },
        { status: 400 }
      );
    }

    // Check if the address is in service area
    const serviceArea = await prisma.serviceArea.findFirst({
      where: {
        province: { name: province },
        district: { name: district },
        ward: { name: ward }
      },
      include: {
        province: true,
        district: true,
        ward: true
      }
    });

    if (!serviceArea) {
      return NextResponse.json({
        success: true,
        data: {
          isServiceable: false,
          message: 'Delivery is not available to this address',
          deliveryFee: 0,
          estimatedDeliveryTime: null
        }
      });
    }

    // Calculate total weight and volume
    let totalWeight = 0;
    let totalVolume = 0;
    let totalValue = 0;

    for (const product of products) {
      const productData = await prisma.product.findUnique({
        where: { id: product.productId }
      });

      if (productData) {
        // Estimate weight and volume based on product type
        const estimatedWeight = productData.category === 'primer' ? 1.5 : 2.0; // kg per liter
        const estimatedVolume = product.quantity; // liters
        
        totalWeight += estimatedWeight * product.quantity;
        totalVolume += estimatedVolume;
        totalValue += (productData.basePrice || 0) * product.quantity;
      }
    }

    // Calculate delivery fee based on distance and weight
    const baseFee = 50000; // Base delivery fee
    const weightFee = Math.ceil(totalWeight / 5) * 10000; // Additional fee per 5kg
    const distanceFee = 0; // Simplified for demo - no distance calculation
    
    const deliveryFee = baseFee + weightFee + distanceFee;

    // Calculate estimated delivery time
    const baseTime = 1; // Base delivery time in days
    const estimatedDeliveryTime = baseTime;

    return NextResponse.json({
      success: true,
      data: {
        isServiceable: true,
        address: {
          province: serviceArea.province.name,
          district: serviceArea.district?.name || '',
          ward: serviceArea.ward?.name || ''
        },
        orderDetails: {
          totalWeight: Math.ceil(totalWeight * 100) / 100,
          totalVolume: Math.ceil(totalVolume * 100) / 100,
          totalValue: Math.ceil(totalValue * 100) / 100
        },
        deliveryFee: Math.ceil(deliveryFee * 100) / 100,
        estimatedDeliveryTime: `${estimatedDeliveryTime} day${estimatedDeliveryTime > 1 ? 's' : ''}`,
        breakdown: {
          baseFee,
          weightFee,
          distanceFee: 0,
          totalFee: deliveryFee
        }
      }
    });

  } catch (error) {
    console.error('Shipping calculation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
