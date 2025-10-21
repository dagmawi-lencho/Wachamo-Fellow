import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const studentId = searchParams.get('studentId');
    
    if (!orderNumber || !studentId) {
      return NextResponse.json(
        { error: 'Order number and Student ID are required' },
        { status: 400 }
      );
    }
    
    // Find transaction by order number and student ID
    const transaction = await Transaction.findOne({
      orderNumber: orderNumber.toUpperCase(),
      studentId: studentId.toUpperCase()
    });
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Order not found. Please check your order number and student ID.' },
        { status: 404 }
      );
    }
    
    // Return transaction details (hide sensitive info)
    return NextResponse.json({
      success: true,
      order: {
        orderNumber: transaction.orderNumber,
        amount: transaction.amount,
        currency: transaction.currency,
        firstName: transaction.firstName,
        lastName: transaction.lastName,
        phoneNumber: transaction.phoneNumber,
        studentId: transaction.studentId,
        bankName: transaction.bankName,
        accountNumber: transaction.accountNumber,
        type: transaction.type,
        productName: transaction.productName,
        orderDetails: transaction.orderDetails,
        receiptUrl: transaction.receiptUrl,
        status: transaction.status,
        rejectionReason: transaction.rejectionReason,
        approvedAt: transaction.approvedAt,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      }
    });
  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track order' },
      { status: 500 }
    );
  }
}

