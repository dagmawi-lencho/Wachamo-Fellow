import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'your-secret-key'
    ) as { id: string; email: string };
    
    return NextResponse.json({
      authenticated: true,
      admin: {
        id: decoded.id,
        email: decoded.email
      }
    });
  } catch {
    // Token is invalid or expired - clear it and return 401
    const response = NextResponse.json(
      { error: 'Invalid or expired token', shouldLogout: true },
      { status: 401 }
    );
    
    // Clear the invalid cookie
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    
    return response;
  }
}

