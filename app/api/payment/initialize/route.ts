import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { amount, email, firstName, lastName, phoneNumber, studentId, bankName, accountNumber, type, productId, productName, orderDetails, receiptUrl } = data;
    
    // Validate required fields
    if (!amount || !firstName || !receiptUrl) {
      return NextResponse.json({ 
        error: 'Missing required fields: amount, full name, and receipt image' 
      }, { status: 400 });
    }
    
    // Generate unique transaction reference
    const txRef = `WCF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate unique order number: WCU + 7 random digits (10 digits total)
    const generateOrderNumber = () => {
      const randomDigits = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
      return `WCU${randomDigits}`;
    };
    
    let orderNumber = generateOrderNumber();
    
    // Ensure order number is unique
    let existingOrder = await Transaction.findOne({ orderNumber });
    while (existingOrder) {
      orderNumber = generateOrderNumber();
      existingOrder = await Transaction.findOne({ orderNumber });
    }
    
    // Calculate expiry time: 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // If this is a product purchase, reduce stock
    let stockReserved = false;
    if (type === 'product' && orderDetails && Array.isArray(orderDetails)) {
      try {
        // Reduce stock for each product in the order
        for (const item of orderDetails) {
          const product = await Product.findById(item.productId || item._id);
          
          if (!product) {
            return NextResponse.json({ 
              error: `Product ${item.name} not found` 
            }, { status: 404 });
          }
          
          // Check if enough stock available
          if (product.stock < item.quantity) {
            return NextResponse.json({ 
              error: `Insufficient stock for ${item.name}. Only ${product.stock} available.` 
            }, { status: 400 });
          }
          
          // Reduce the stock
          product.stock -= item.quantity;
          await product.save();
        }
        stockReserved = true;
      } catch (error) {
        console.error('Stock reduction error:', error);
        return NextResponse.json({ 
          error: 'Failed to reserve stock. Please try again.' 
        }, { status: 500 });
      }
    }
    
    // Create transaction record (pending admin approval)
    const transaction = await Transaction.create({
      txRef,
      orderNumber,
      amount,
      currency: 'ETB',
      email: email || undefined,
      firstName,
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      studentId: studentId || undefined,
      bankName: bankName || undefined,
      accountNumber: accountNumber || undefined,
      type,
      productId,
      productName,
      orderDetails,
      receiptUrl,
      status: 'pending',
      expiresAt,
      stockReserved
    });
    
    return NextResponse.json({
      success: true,
      message: 'Order submitted successfully! Admin will verify your payment.',
      txRef,
      orderNumber,
      transactionId: transaction._id
    });
  } catch (error: unknown) {
    console.error('Transaction creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create transaction';
    return NextResponse.json({ 
      error: message
    }, { status: 500 });
  }
}

