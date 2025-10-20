import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// Approve transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        status: data.status,
        rejectionReason: data.rejectionReason,
        approvedBy: data.approvedBy,
        approvedAt: data.status === 'approved' ? new Date() : undefined
      },
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

