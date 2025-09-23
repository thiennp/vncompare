import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      businessInfo, 
      contactInfo 
    } = await request.json();

    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { success: false, message: 'Name, email, phone, and address are required' },
        { status: 400 }
      );
    }

    // Check if supplier already exists
    const existingSupplier = await prisma.supplier.findFirst({
      where: { email }
    });

    if (existingSupplier) {
      return NextResponse.json(
        { success: false, message: 'Supplier with this email already exists' },
        { status: 409 }
      );
    }

    // Create new supplier
    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        businessInfo: businessInfo ? JSON.stringify(businessInfo) : null,
        contactInfo: contactInfo ? JSON.stringify(contactInfo) : null,
        isVerified: false
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        isVerified: supplier.isVerified,
        createdAt: supplier.createdAt
      }
    });

  } catch (error) {
    console.error('Supplier registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { address: { contains: search } }
      ];
    }

    if (status) {
      where.isVerified = status === 'verified';
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.supplier.count({ where });

    return NextResponse.json({
      success: true,
      data: suppliers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get suppliers error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
