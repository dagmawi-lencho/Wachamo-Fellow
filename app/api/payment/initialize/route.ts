import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { Chapa } from 'chapa-nodejs';

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY || ''
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { amount, email, firstName, lastName, phoneNumber, type, productId, productName } = data;
    
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
      phoneNumber,
      type,
      productId,
      productName,
      status: 'pending'
    });
    
    // Initialize Chapa payment
    const paymentData = {
      amount: amount.toString(),
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
    };
    
    console.log('Initializing Chapa with:', JSON.stringify(paymentData, null, 2));
    
    const response = await chapa.initialize(paymentData);
    
    console.log('Chapa response:', JSON.stringify(response, null, 2));
    
    if (response.status === 'success' && response.data) {
      return NextResponse.json({
        success: true,
        checkoutUrl: response.data.checkout_url,
        txRef
      });
    } else {
      throw new Error('Failed to initialize payment');
    }
  } catch (error: unknown) {
    console.error('Payment initialization error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    const message = error instanceof Error ? error.message : 'Failed to initialize payment';
    return NextResponse.json({ 
      error: message,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

