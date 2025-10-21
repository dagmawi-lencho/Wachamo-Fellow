import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();
    
    // Total members
    const totalMembers = await Member.countDocuments();
    
    // Members by status
    const newMembers = await Member.countDocuments({ membershipStatus: 'New Member' });
    const existingMembers = await Member.countDocuments({ membershipStatus: 'Existing Member' });
    
    // Members by gender
    const maleMembers = await Member.countDocuments({ sex: 'Male' });
    const femaleMembers = await Member.countDocuments({ sex: 'Female' });
    
    // Born again statistics
    const bornAgainYes = await Member.countDocuments({ bornAgain: 'Yes' });
    const bornAgainNo = await Member.countDocuments({ bornAgain: 'No' });
    
    // Bible study attendance
    const attendingBibleStudy = await Member.countDocuments({ attendingBibleStudy: 'Yes' });
    const notAttendingBibleStudy = await Member.countDocuments({ attendingBibleStudy: 'No' });
    
    // Members by college (top 5)
    const membersByCollege = await Member.aggregate([
      { $group: { _id: '$college', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Members by department (top 10)
    const membersByDepartment = await Member.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Members by academic year
    const membersByYear = await Member.aggregate([
      { $group: { _id: '$academicYear', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = await Member.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Fellowship teams distribution
    const fellowshipTeams = await Member.aggregate([
      { $group: { _id: '$fellowshipTeam', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Transaction/Revenue Statistics
    // Total revenue from APPROVED transactions only
    const approvedTransactions = await Transaction.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Donations revenue (approved only)
    const donationRevenue = await Transaction.aggregate([
      { $match: { status: 'approved', type: 'donation' } },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Product sales revenue (approved only)
    const salesRevenue = await Transaction.aggregate([
      { $match: { status: 'approved', type: 'product' } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Transaction counts by status
    const pendingCount = await Transaction.countDocuments({ status: 'pending' });
    const approvedCount = await Transaction.countDocuments({ status: 'approved' });
    const rejectedCount = await Transaction.countDocuments({ status: 'rejected' });

    const totalRevenue = approvedTransactions[0]?.totalRevenue || 0;
    const totalDonations = donationRevenue[0]?.totalDonations || 0;
    const totalSales = salesRevenue[0]?.totalSales || 0;
    
    return NextResponse.json({
      overview: {
        totalMembers,
        newMembers,
        existingMembers,
        maleMembers,
        femaleMembers,
        bornAgainYes,
        bornAgainNo,
        attendingBibleStudy,
        notAttendingBibleStudy,
        // Add revenue stats to overview
        totalRevenue,
        totalDonations,
        totalSales,
        pendingTransactions: pendingCount,
        approvedTransactions: approvedCount,
        rejectedTransactions: rejectedCount
      },
      charts: {
        membersByCollege,
        membersByDepartment,
        membersByYear,
        recentRegistrations,
        fellowshipTeams
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch statistics';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

