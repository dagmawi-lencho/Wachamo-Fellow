// Permission constants for admin features
export const PERMISSIONS = {
  // Main Tabs
  VIEW_OVERVIEW: 'view_overview',
  VIEW_MEMBERS: 'view_members',
  VIEW_TRANSACTIONS: 'view_transactions',
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_BANKS: 'view_banks',
  
  // Member Management
  EDIT_MEMBERS: 'edit_members',
  DELETE_MEMBERS: 'delete_members',
  
  // Transaction Management
  APPROVE_TRANSACTIONS: 'approve_transactions',
  REJECT_TRANSACTIONS: 'reject_transactions',
  VIEW_RECEIPTS: 'view_receipts',
  
  // Settings & Configuration
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_PAYMENT_SETTINGS: 'manage_payment_settings',
  MANAGE_REGISTRATION_SETTINGS: 'manage_registration_settings',
  MANAGE_BIBLE_QUOTES: 'manage_bible_quotes',
  
  // Bank Management
  MANAGE_BANKS: 'manage_banks',
  
  // Data Export
  EXPORT_DATA: 'export_data',
  
  // Super Admin Only
  MANAGE_ADMINS: 'manage_admins',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Default permissions for super admin (all permissions)
export const SUPER_ADMIN_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

// Grouped permissions for UI display
export const PERMISSION_GROUPS = {
  'Dashboard Tabs': [
    { id: PERMISSIONS.VIEW_OVERVIEW, label: 'View Overview Dashboard', description: 'Access to statistics and quick insights' },
    { id: PERMISSIONS.VIEW_MEMBERS, label: 'View Members', description: 'Access to members list and information' },
    { id: PERMISSIONS.VIEW_TRANSACTIONS, label: 'View Transactions', description: 'Access to transaction history' },
    { id: PERMISSIONS.VIEW_ANALYTICS, label: 'View Analytics', description: 'Access to charts and data analysis' },
    { id: PERMISSIONS.VIEW_BANKS, label: 'View Banks', description: 'Access to bank accounts list' },
  ],
  'Member Management': [
    { id: PERMISSIONS.EDIT_MEMBERS, label: 'Edit Members', description: 'Modify member information' },
    { id: PERMISSIONS.DELETE_MEMBERS, label: 'Delete Members', description: 'Remove members from database' },
  ],
  'Transaction Management': [
    { id: PERMISSIONS.APPROVE_TRANSACTIONS, label: 'Approve Transactions', description: 'Approve pending payments' },
    { id: PERMISSIONS.REJECT_TRANSACTIONS, label: 'Reject Transactions', description: 'Reject pending payments' },
    { id: PERMISSIONS.VIEW_RECEIPTS, label: 'View Receipts', description: 'View payment receipts' },
  ],
  'Products & Shop': [
    { id: PERMISSIONS.MANAGE_PRODUCTS, label: 'Manage Products', description: 'Add, edit, and delete products' },
  ],
  'Settings & Configuration': [
    { id: PERMISSIONS.MANAGE_PAYMENT_SETTINGS, label: 'Manage Payment Settings', description: 'Configure payment options' },
    { id: PERMISSIONS.MANAGE_REGISTRATION_SETTINGS, label: 'Manage Registration Settings', description: 'Open/close registration periods' },
    { id: PERMISSIONS.MANAGE_BIBLE_QUOTES, label: 'Manage Bible Quotes', description: 'Add and edit inspirational quotes' },
    { id: PERMISSIONS.MANAGE_BANKS, label: 'Manage Bank Accounts', description: 'Add, edit, and delete bank accounts' },
  ],
  'Data & Reports': [
    { id: PERMISSIONS.EXPORT_DATA, label: 'Export Data', description: 'Download reports and data exports' },
  ],
  'Admin Management': [
    { id: PERMISSIONS.MANAGE_ADMINS, label: 'Manage Admins (Super Admin Only)', description: 'Create and manage other administrators' },
  ],
};

// Helper function to check if user has permission
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission);
}

// Helper function to check if user has any of the permissions
export function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}

// Helper function to check if user is super admin
export function isSuperAdmin(role: Role): boolean {
  return role === ROLES.SUPER_ADMIN;
}

