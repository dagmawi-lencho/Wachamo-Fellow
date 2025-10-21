import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bank from '@/models/Bank';

// PUT - Update bank
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    
    const bank = await Bank.findByIdAndUpdate(
      params.id,
      {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountHolderName: data.accountHolderName,
        isActive: data.isActive
      },
      { new: true }
    );
    
    if (!bank) {
      return NextResponse.json(
        { error: 'Bank not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, bank });
  } catch (error) {
    console.error('Error updating bank:', error);
    return NextResponse.json(
      { error: 'Failed to update bank' },
      { status: 500 }
    );
  }
}

// DELETE - Delete bank
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Soft delete by setting isActive to false
    const bank = await Bank.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!bank) {
      return NextResponse.json(
        { error: 'Bank not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bank:', error);
    return NextResponse.json(
      { error: 'Failed to delete bank' },
      { status: 500 }
    );
  }
}

