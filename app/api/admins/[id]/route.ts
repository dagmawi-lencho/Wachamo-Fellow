import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

// Delete admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Prevent deleting the last admin
    const adminCount = await Admin.countDocuments();
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last admin account' },
        { status: 400 }
      );
    }
    
    const admin = await Admin.findByIdAndDelete(id);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete admin';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Update admin password
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { password } = await request.json();
    
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await Admin.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update admin';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

