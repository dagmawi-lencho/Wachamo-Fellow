import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bank from '@/models/Bank';

// GET all banks
export async function GET() {
  try {
    await connectDB();
    const banks = await Bank.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banks' },
      { status: 500 }
    );
  }
}

// POST - Create new bank
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    const bank = await Bank.create({
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName || 'Wachamo Fellowship',
      isActive: true
    });
    
    return NextResponse.json({ 
      success: true, 
      bank 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating bank:', error);
    return NextResponse.json(
      { error: 'Failed to create bank' },
      { status: 500 }
    );
  }
}

