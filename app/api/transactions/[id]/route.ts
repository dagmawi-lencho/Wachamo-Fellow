import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// Update transaction status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    
    // Prepare update data based on status
    const updateData: {
      status: string;
      rejectionReason?: string | null;
      approvedBy?: string | null;
      approvedAt?: Date | null;
    } = {
      status: data.status
    };

    // If approving, set approval data
    if (data.status === 'approved') {
      updateData.approvedBy = data.approvedBy;
      updateData.approvedAt = new Date();
      updateData.rejectionReason = null; // Clear rejection reason if previously rejected
    }
    
    // If rejecting, set rejection reason
    if (data.status === 'rejected') {
      updateData.rejectionReason = data.rejectionReason;
      updateData.approvedBy = null; // Clear approval data if previously approved
      updateData.approvedAt = null;
    }
    
    // If reverting to pending, clear all approval/rejection data
    if (data.status === 'pending') {
      updateData.rejectionReason = null;
      updateData.approvedBy = null;
      updateData.approvedAt = null;
    }
    
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Transaction ${data.status} successfully`,
      transaction
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update transaction';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

