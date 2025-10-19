import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// Get all products
export async function GET() {
  try {
    await connectDB();
    
    const products = await Product.find({ isAvailable: true })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Create product (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const product = await Product.create(data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product 
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

