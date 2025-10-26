import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { SUPER_ADMIN_PERMISSIONS, ROLES } from '@/lib/permissions';

/**
 * API endpoint to create the initial super admin
 * This should only work if no admins exist in the database
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if any admins exist
    const adminCount = await Admin.countDocuments();
    
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'Admins already exist. Use the admin management interface to create additional admins.' },
        { status: 400 }
      );
    }
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }
    
    // Create super admin
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const superAdmin = await Admin.create({
      email,
      password: hashedPassword,
      role: ROLES.SUPER_ADMIN,
      permissions: SUPER_ADMIN_PERMISSIONS
    });
    
    return NextResponse.json({
      success: true,
      message: 'Super admin created successfully',
      admin: {
        id: superAdmin._id,
        email: superAdmin.email,
        role: superAdmin.role
      }
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create super admin';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

