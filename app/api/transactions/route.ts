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

export async function GET() {
  try {
    await connectDB();
    
    // Auto-expire old pending transactions (24 hours)
    const now = new Date();
    const expiredTransactions = await Transaction.find({
      status: 'pending',
      expiresAt: { $lt: now }
    });
    
    // Expire and restore stock for expired transactions
    for (const transaction of expiredTransactions) {
      if (transaction.stockReserved) {
        await restoreStock(transaction);
      }
      
      transaction.status = 'expired';
      transaction.rejectionReason = 'Order expired after 24 hours without approval';
      transaction.stockReserved = false;
      await transaction.save();
    }
    
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(500); // Last 500 transactions
    
    // Calculate statistics
    const stats = {
      totalRevenue: await Transaction.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      totalDonations: await Transaction.aggregate([
        { $match: { status: 'approved', type: 'donation' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      totalSales: await Transaction.aggregate([
        { $match: { status: 'approved', type: 'product' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      successCount: await Transaction.countDocuments({ status: 'approved' }),
      pendingCount: await Transaction.countDocuments({ status: 'pending' }),
      failedCount: await Transaction.countDocuments({ status: { $in: ['rejected', 'expired'] } }),
      recentTransactions: await Transaction.aggregate([
        { $match: { status: 'approved' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            amount: { $sum: '$amount' }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ])
    };
    
    return NextResponse.json({
      transactions,
      stats: {
        totalRevenue: stats.totalRevenue[0]?.total || 0,
        totalDonations: stats.totalDonations[0]?.total || 0,
        totalSales: stats.totalSales[0]?.total || 0,
        successCount: stats.successCount,
        pendingCount: stats.pendingCount,
        failedCount: stats.failedCount,
        recentTransactions: stats.recentTransactions
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

