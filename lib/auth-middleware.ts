import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Permission, Role, isSuperAdmin as checkSuperAdmin } from '@/lib/permissions';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

/**
 * Verify admin authentication from request cookies
 * Returns the authenticated admin or throws an error
 */
export async function verifyAdmin(request: NextRequest): Promise<AuthenticatedAdmin> {
  const token = request.cookies.get('admin-token')?.value;
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'your-secret-key'
    ) as AuthenticatedAdmin;
    
    return decoded;
  } catch {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Check if admin has a specific permission
 */
export function checkPermission(admin: AuthenticatedAdmin, requiredPermission: Permission): boolean {
  // Super admin has all permissions
  if (checkSuperAdmin(admin.role)) {
    return true;
  }
  
  return admin.permissions.includes(requiredPermission);
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedAdmin | NextResponse> {
  try {
    return await verifyAdmin(request);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Middleware to require specific permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: Permission
): Promise<AuthenticatedAdmin | NextResponse> {
  try {
    const admin = await verifyAdmin(request);
    
    if (!checkPermission(admin, permission)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return admin;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Middleware to require super admin role
 */
export async function requireSuperAdmin(request: NextRequest): Promise<AuthenticatedAdmin | NextResponse> {
  try {
    const admin = await verifyAdmin(request);
    
    if (!checkSuperAdmin(admin.role)) {
      return NextResponse.json(
        { error: 'Super admin access required' },
        { status: 403 }
      );
    }
    
    return admin;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 401 }
    );
  }
}

