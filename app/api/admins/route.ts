import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

// Get all admins
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({
      admins
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admins';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Create new admin
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword
    });
    
    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt
      }
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create admin';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

