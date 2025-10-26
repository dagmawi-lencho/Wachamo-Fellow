'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Permission, Role, hasPermission, isSuperAdmin, SUPER_ADMIN_PERMISSIONS } from '@/lib/permissions';

interface Admin {
  id: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

interface PermissionContextType {
  admin: Admin | null;
  setAdmin: (admin: Admin | null) => void;
  hasPermission: (permission: Permission) => boolean;
  isSuperAdmin: () => boolean;
  isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [admin, setAdminState] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verify admin authentication and get permissions on mount
    const verifyAdmin = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          const data = await response.json();
          if (data.admin) {
            setAdminState({
              id: data.admin.id,
              email: data.admin.email,
              role: data.admin.role || 'admin',
              permissions: data.admin.permissions || []
            });
          }
        }
      } catch (error) {
        console.error('Error verifying admin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const checkPermission = (permission: Permission): boolean => {
    if (!admin) return false;
    
    // Super admin has all permissions
    if (isSuperAdmin(admin.role)) {
      return true;
    }
    
    return hasPermission(admin.permissions, permission);
  };

  const checkIsSuperAdmin = (): boolean => {
    if (!admin) return false;
    return isSuperAdmin(admin.role);
  };

  const setAdmin = (newAdmin: Admin | null) => {
    setAdminState(newAdmin);
    setIsLoading(false);
  };

  return (
    <PermissionContext.Provider
      value={{
        admin,
        setAdmin,
        hasPermission: checkPermission,
        isSuperAdmin: checkIsSuperAdmin,
        isLoading
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

