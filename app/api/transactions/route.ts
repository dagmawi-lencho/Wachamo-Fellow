import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();
    
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(500); // Last 500 transactions
    
    // Calculate statistics
    const stats = {
      totalRevenue: await Transaction.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      totalDonations: await Transaction.aggregate([
        { $match: { status: 'success', type: 'donation' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      totalSales: await Transaction.aggregate([
        { $match: { status: 'success', type: 'product' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      successCount: await Transaction.countDocuments({ status: 'success' }),
      pendingCount: await Transaction.countDocuments({ status: 'pending' }),
      failedCount: await Transaction.countDocuments({ status: 'failed' }),
      recentTransactions: await Transaction.aggregate([
        { $match: { status: 'success' } },
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

