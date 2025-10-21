import { NextResponse } from 'next/server';
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

export async function POST() {
  try {
    await connectDB();
    
    // Find all pending transactions that have expired
    const now = new Date();
    const expiredTransactions = await Transaction.find({
      status: 'pending',
      expiresAt: { $lt: now }
    });
    
    let expiredCount = 0;
    let stockRestoredCount = 0;
    
    // Expire each transaction and restore stock
    for (const transaction of expiredTransactions) {
      // Restore stock if it was reserved
      if (transaction.stockReserved) {
        const restored = await restoreStock(transaction);
        if (restored) {
          stockRestoredCount++;
        }
      }
      
      // Update transaction status to expired
      transaction.status = 'expired';
      transaction.rejectionReason = 'Order expired after 24 hours without approval';
      transaction.stockReserved = false;
      await transaction.save();
      
      expiredCount++;
    }
    
    return NextResponse.json({
      success: true,
      message: `Expired ${expiredCount} transactions and restored stock for ${stockRestoredCount} product orders`,
      expiredCount,
      stockRestoredCount
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to expire transactions';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

