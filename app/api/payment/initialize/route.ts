import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import PaymentSettings from '@/models/PaymentSettings';
import { Chapa } from 'chapa-nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Get Chapa keys from database
    const paymentSettings = await PaymentSettings.findOne();
    if (!paymentSettings?.chapaSecretKey) {
      return NextResponse.json({ 
        error: 'Payment gateway not configured. Please contact administrator.' 
      }, { status: 503 });
    }
    
    const data = await request.json();
    const { amount, email, firstName, lastName, phoneNumber, type, productId, productName } = data;
    
    // Validate required fields
    if (!amount || !email || !firstName || !lastName) {
      return NextResponse.json({ 
        error: 'Missing required fields: amount, email, firstName, lastName' 
      }, { status: 400 });
    }
    
    // Generate unique transaction reference
    const txRef = `WCF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create transaction record
    await Transaction.create({
      txRef,
      amount,
      currency: 'ETB',
      email,
      firstName,
      lastName,
      phoneNumber: phoneNumber || '',
      type,
      productId,
      productName,
      status: 'pending'
    });
    
    // Initialize Chapa with key from database
    const chapa = new Chapa(paymentSettings.chapaSecretKey);
    
    const response = await chapa.initialize({
      amount: amount,
      currency: 'ETB',
      email: email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,
      callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/verify`,
      return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success?tx_ref=${txRef}`,
      customization: {
        title: type === 'donation' ? 'Wachamo Fellowship Donation' : 'Wachamo Fellowship Shop',
        description: productName || 'Support Wachamo Fellowship',
      }
    });
    
    console.log('Chapa initialized successfully:', response);
    
    if (response.status === 'success' && response.data) {
      return NextResponse.json({
        success: true,
        checkoutUrl: response.data.checkout_url,
        txRef
      });
    } else {
      throw new Error('Chapa initialization failed');
    }
  } catch (error: unknown) {
    console.error('Payment initialization error:', error);
    const message = error instanceof Error ? error.message : 'Failed to initialize payment';
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      error: message,
      details: process.env.NODE_ENV === 'development' ? details : undefined
    }, { status: 500 });
  }
}

