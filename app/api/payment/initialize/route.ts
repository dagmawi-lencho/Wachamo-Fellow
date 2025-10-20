import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { amount, email, firstName, lastName, phoneNumber, studentId, type, productId, productName, orderDetails, receiptUrl } = data;
    
    // Validate required fields
    if (!amount || !firstName || !receiptUrl) {
      return NextResponse.json({ 
        error: 'Missing required fields: amount, full name, and receipt image' 
      }, { status: 400 });
    }
    
    // Generate unique transaction reference
    const txRef = `WCF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create transaction record (pending admin approval)
    const transaction = await Transaction.create({
      txRef,
      amount,
      currency: 'ETB',
      email: email || '',
      firstName,
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      studentId: studentId || '',
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

