import { PermissionProvider } from '@/contexts/PermissionContext';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionProvider>
      {children}
    </PermissionProvider>
  );
}

