import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PaymentSettings from '@/models/PaymentSettings';

export async function GET() {
  try {
    await connectDB();
    
    let settings = await PaymentSettings.findOne();
    
    if (!settings) {
      settings = await PaymentSettings.create({
        chapaPublicKey: '',
        chapaSecretKey: '',
        bankAccounts: []
      });
    }
    
    return NextResponse.json({
      settings: {
        chapaPublicKey: settings.chapaPublicKey || '',
        chapaSecretKey: settings.chapaSecretKey ? '••••••••' : '', // Hide secret key
        hasChapaKeys: !!(settings.chapaPublicKey && settings.chapaSecretKey),
        bankAccounts: settings.bankAccounts || []
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    let settings = await PaymentSettings.findOne();
    
    if (!settings) {
      settings = await PaymentSettings.create(data);
    } else {
      settings = await PaymentSettings.findByIdAndUpdate(
        settings._id,
        data,
        { new: true }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment settings updated successfully'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

