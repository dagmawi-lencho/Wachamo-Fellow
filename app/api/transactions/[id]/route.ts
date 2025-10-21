import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Product from '@/models/Product';

// Helper function to restore stock
async function restoreStock(transaction: any) {
  if (transaction.type === 'product' && transaction.stockReserved && transaction.orderDetails && Array.isArray(transaction.orderDetails)) {
    try {
      for (const item of transaction.orderDetails) {
        const product = await Product.findById(item.productId || item._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
      return true;
    } catch (error) {
      console.error('Stock restoration error:', error);
      return false;
    }
  }
  return false;
}

// Update transaction status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    
    // Get the existing transaction first
    const existingTransaction = await Transaction.findById(id);
    
    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    // Prepare update data based on status
    const updateData: {
      status: string;
      rejectionReason?: string | null;
      approvedBy?: string | null;
      approvedAt?: Date | null;
      stockReserved?: boolean;
    } = {
      status: data.status
    };

    // If approving, set approval data (keep stock reserved)
    if (data.status === 'approved') {
      updateData.approvedBy = data.approvedBy;
      updateData.approvedAt = new Date();
      updateData.rejectionReason = null;
      // Stock stays reduced
    }
    
    // If rejecting, restore stock and clear approval data
    if (data.status === 'rejected') {
      updateData.rejectionReason = data.rejectionReason;
      updateData.approvedBy = null;
      updateData.approvedAt = null;
      
      // Restore stock if it was reserved
      if (existingTransaction.stockReserved) {
        await restoreStock(existingTransaction);
        updateData.stockReserved = false;
      }
    }
    
    // If reverting to pending, clear all approval/rejection data but keep stock reserved
    if (data.status === 'pending') {
      updateData.rejectionReason = null;
      updateData.approvedBy = null;
      updateData.approvedAt = null;
      
      // If coming from rejected, we need to re-reserve stock
      if (existingTransaction.status === 'rejected' && existingTransaction.type === 'product' && existingTransaction.orderDetails) {
        try {
          for (const item of existingTransaction.orderDetails) {
            const product = await Product.findById(item.productId || item._id);
            if (product) {
              if (product.stock < item.quantity) {
                return NextResponse.json({ 
                  error: `Insufficient stock to restore pending status. ${item.name} only has ${product.stock} available.` 
                }, { status: 400 });
              }
              product.stock -= item.quantity;
              await product.save();
            }
          }
          updateData.stockReserved = true;
        } catch (error) {
          console.error('Stock re-reservation error:', error);
          return NextResponse.json({ 
            error: 'Failed to re-reserve stock' 
          }, { status: 500 });
        }
      }
    }
    
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
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

// Delete transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Get the transaction first to check if we need to restore stock
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    // Restore stock if it was reserved and transaction is not approved
    if (transaction.stockReserved && transaction.status !== 'approved') {
      await restoreStock(transaction);
    }
    
    // Delete the transaction
    await Transaction.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete transaction';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
