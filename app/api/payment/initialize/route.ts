import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

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
      status: 'pending'
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

