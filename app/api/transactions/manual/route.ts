import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Returns error response if not authenticated
    }
    // Admin is authenticated (authResult is AuthenticatedAdmin)

    await connectDB();
    
    const data = await request.json();
    const { 
      firstName, lastName, phoneNumber, studentId, amount, 
      paymentType, firstPaymentAmount, remainingAmount,
      type, productName, orderDetails, receiptUrl, isManualEntry 
    } = data;
    
    // Validate required fields
    if (!amount || !firstName || !phoneNumber) {
      return NextResponse.json({ 
        error: 'Missing required fields: amount, firstName, and phoneNumber' 
      }, { status: 400 });
    }

    if (paymentType === 'partial' && (!firstPaymentAmount || firstPaymentAmount <= 0)) {
      return NextResponse.json({ 
        error: 'First payment amount is required for partial payments' 
      }, { status: 400 });
    }
    
    // Generate unique transaction reference
    const txRef = `WCF-MANUAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate unique order number: WCU + 7 random digits (10 digits total)
    const generateOrderNumber = () => {
      const randomDigits = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
      return `WCU${randomDigits}`;
    };
    
    let orderNumber = generateOrderNumber();
    
    // Ensure order number is unique
    let existingOrder = await Transaction.findOne({ orderNumber });
    while (existingOrder) {
      orderNumber = generateOrderNumber();
      existingOrder = await Transaction.findOne({ orderNumber });
    }
    
    // Calculate expiry time: 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // If this is a product purchase, reduce stock
    let stockReserved = false;
    if (type === 'product' && orderDetails && Array.isArray(orderDetails)) {
      try {
        // Reduce stock for each product in the order
        for (const item of orderDetails) {
          const product = await Product.findById(item.productId || item._id);
          
          if (!product) {
            return NextResponse.json({ 
              error: `Product ${item.name} not found` 
            }, { status: 404 });
          }
          
          // Check if enough stock available
          if (product.stock < item.quantity) {
            return NextResponse.json({ 
              error: `Insufficient stock for ${item.name}. Only ${product.stock} available.` 
            }, { status: 400 });
          }
          
          // Reduce the stock
          product.stock -= item.quantity;
          await product.save();
        }
        stockReserved = true;
      } catch (error) {
        console.error('Stock reduction error:', error);
        return NextResponse.json({ 
          error: 'Failed to reserve stock. Please try again.' 
        }, { status: 500 });
      }
    }
    
    // Create transaction record (pending admin approval, same flow as online orders)
    const transaction = await Transaction.create({
      txRef,
      orderNumber,
      amount,
      currency: 'ETB',
      firstName,
      lastName: lastName || firstName,
      phoneNumber,
      studentId: studentId || undefined,
      type,
      productName,
      orderDetails,
      receiptUrl: receiptUrl || undefined,
      status: 'pending',
      expiresAt,
      stockReserved,
      isManualEntry: isManualEntry || true,
      paymentType: paymentType || 'full',
      firstPaymentAmount: paymentType === 'partial' ? firstPaymentAmount : undefined,
      remainingAmount: paymentType === 'partial' ? remainingAmount : undefined,
      remainingPaid: false
    });
    
    return NextResponse.json({
      success: true,
      message: 'Manual sale created successfully! Transaction is pending approval.',
      txRef,
      orderNumber,
      transactionId: transaction._id
    });
  } catch (error: unknown) {
    console.error('Manual sale creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create manual sale';
    return NextResponse.json({ 
      error: message
    }, { status: 500 });
  }
}

