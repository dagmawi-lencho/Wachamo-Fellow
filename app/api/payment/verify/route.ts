import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { Chapa } from 'chapa-nodejs';

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY || ''
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get('tx_ref');
    
    if (!txRef) {
      return NextResponse.json({ error: 'Transaction reference required' }, { status: 400 });
    }
    
    // Verify payment with Chapa
    const verification = await chapa.verify({ tx_ref: txRef });
    
    if (verification.status === 'success' && verification.data.status === 'success') {
      // Update transaction status
      await Transaction.findOneAndUpdate(
        { txRef },
        { 
          status: 'success',
          chapaReference: verification.data.reference
        }
      );
      
      return NextResponse.json({
        success: true,
        status: 'success',
        data: verification.data
      });
    } else {
      // Update to failed status
      await Transaction.findOneAndUpdate(
        { txRef },
        { status: 'failed' }
      );
      
      return NextResponse.json({
        success: false,
        status: 'failed',
        message: 'Payment verification failed'
      });
    }
  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    const message = error instanceof Error ? error.message : 'Failed to verify payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

