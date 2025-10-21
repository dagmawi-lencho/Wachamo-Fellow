import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login attempt started...');
    await connectDB();
    console.log('✅ MongoDB connected');
    
    const { email, password } = await request.json();
    console.log('📧 Login attempt for email:', email);
    
    // For initial setup, check if admin exists, if not create one
    let admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log('👤 Admin not found, creating default admin...');
      // Create default admin if none exists
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      admin = await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@wachamo.edu.et',
        password: hashedPassword
      });
      console.log('✅ Default admin created');
    } else {
      console.log('👤 Admin found in database');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log('🔑 Password valid:', isValidPassword);
    
    if (admin.email !== email || !isValidPassword) {
      console.log('❌ Login failed: Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('✅ Login successful, generating token...');
    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
    
    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    console.log('🎉 Login complete, cookie set with path: /');
    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

