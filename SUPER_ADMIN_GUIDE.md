# Super Admin & Permission System Guide

## Overview

The Wachamo Fellowship admin system now includes a comprehensive role-based access control (RBAC) system with two roles:
- **Super Admin**: Has all permissions and can manage other admins
- **Admin**: Has limited permissions granted by super admins

## Quick Start

### 1. Create Your First Super Admin

You have two options to create the initial super admin:

#### Option A: Using the API Setup Endpoint (Recommended)
1. Visit `/api/setup/super-admin` endpoint
2. Send a POST request with:
```json
{
  "email": "superadmin@wachamo.edu.et",
  "password": "YourSecurePassword123!"
}
```

Note: This endpoint only works if NO admins exist in the database.

#### Option B: Using the Setup Script
```bash
npm run create-super-admin
```

This will create a super admin using credentials from your environment variables:
- `SUPER_ADMIN_EMAIL` (default: superadmin@wachamo.edu.et)
- `SUPER_ADMIN_PASSWORD` (default: SuperAdmin@2024)

Add these to your `.env.local` file to customize the credentials.

### 2. Login as Super Admin

1. Navigate to `/admin/login`
2. Enter your super admin credentials
3. You'll be redirected to the dashboard with full access

## Permissions

The system includes the following granular permissions:

### Dashboard Tabs
- **View Overview** - Access to statistics and quick insights
- **View Members** - Access to members list and information
- **View Transactions** - Access to transaction history
- **View Analytics** - Access to charts and data analysis
- **View Banks** - Access to bank accounts list

### Member Management
- **Edit Members** - Modify member information
- **Delete Members** - Remove members from database

### Transaction Management
- **Approve Transactions** - Approve pending payments
- **Reject Transactions** - Reject pending payments
- **View Receipts** - View payment receipts

### Products & Shop
- **Manage Products** - Add, edit, and delete products

### Settings & Configuration
- **Manage Payment Settings** - Configure payment options
- **Manage Registration Settings** - Open/close registration periods
- **Manage Bible Quotes** - Add and edit inspirational quotes
- **Manage Bank Accounts** - Add, edit, and delete bank accounts

### Data & Reports
- **Export Data** - Download reports and data exports

### Admin Management (Super Admin Only)
- **Manage Admins** - Create and manage other administrators

## Creating New Admins

As a super admin:

1. Click the **"Admins"** button in the dashboard header
2. Click **"Add New Admin"**
3. Fill in the admin's details:
   - Email address
   - Password (min. 6 characters)
   - Confirm password
4. Select permissions by:
   - Expanding permission groups (Dashboard Tabs, Member Management, etc.)
   - Checking/unchecking individual permissions
   - Using "Select All" or "Clear All" buttons
5. Click **"Create Admin"**

## Managing Permissions

### Permission Groups

Permissions are organized into logical groups for easy management:

1. **Dashboard Tabs** - Control which tabs the admin can see
2. **Member Management** - Control member CRUD operations
3. **Transaction Management** - Control transaction approvals
4. **Products & Shop** - Control product management
5. **Settings & Configuration** - Control various settings
6. **Data & Reports** - Control data export
7. **Admin Management** - Super admin only

### Best Practices

1. **Principle of Least Privilege**: Only grant permissions that are absolutely necessary
2. **Regular Audits**: Periodically review admin permissions
3. **Role Templates**: Create standard permission sets for common roles:
   - **Data Entry Admin**: Members (View, Edit), Transactions (View)
   - **Finance Admin**: Transactions (View, Approve, Reject, Receipts), Banks (Manage)
   - **Content Admin**: Products (Manage), Quotes (Manage)

## Security Features

### Password Security
- All passwords are hashed using bcrypt (10 rounds)
- Minimum password length: 6 characters (8+ recommended)
- Passwords are never stored in plain text

### Session Management
- JWT tokens with 7-day expiration
- HTTP-only cookies prevent XSS attacks
- Automatic logout on token expiration

### Permission Enforcement
- **Frontend**: UI elements hidden based on permissions
- **Backend**: API endpoints protected with middleware
- **Database**: Role and permissions validated on every request

## Admin Management

### Viewing Admins

In the Admin Management dialog, you can see:
- Email address
- Role (Super Admin or Admin)
- Number of granted permissions
- Creation date

### Deleting Admins

Super admins can delete regular admins:
- Cannot delete yourself
- Cannot delete the last admin
- Cannot delete other super admins

### Upgrading Admins

To upgrade an admin to super admin:
1. Delete the existing admin
2. Recreate with full permissions
3. Or run the setup script to upgrade existing admin

## API Integration

### Checking Permissions in API Routes

```typescript
import { requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

export async function POST(request: NextRequest) {
  // Require specific permission
  const result = await requirePermission(request, PERMISSIONS.EDIT_MEMBERS);
  
  // If result is NextResponse, permission was denied
  if (result instanceof NextResponse) {
    return result;
  }
  
  // result is the authenticated admin
  const admin = result;
  
  // Your logic here...
}
```

### Available Middleware Functions

- `requireAuth(request)` - Requires any authenticated admin
- `requirePermission(request, permission)` - Requires specific permission
- `requireSuperAdmin(request)` - Requires super admin role

## Frontend Integration

### Using the Permission Hook

```typescript
import { usePermissions } from '@/contexts/PermissionContext';
import { PERMISSIONS } from '@/lib/permissions';

function MyComponent() {
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  return (
    <>
      {hasPermission(PERMISSIONS.EDIT_MEMBERS) && (
        <Button onClick={handleEdit}>Edit Member</Button>
      )}
      
      {isSuperAdmin() && (
        <Button onClick={handleAdminSettings}>Admin Settings</Button>
      )}
    </>
  );
}
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Super Admin Credentials (for setup script)
SUPER_ADMIN_EMAIL=superadmin@wachamo.edu.et
SUPER_ADMIN_PASSWORD=YourSecurePassword123!

# JWT Secret (keep this secure!)
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-in-production
```

## Troubleshooting

### Cannot Login
- Check if admin exists in database
- Verify password is correct
- Check browser console for errors
- Verify JWT secret is set in environment

### Permissions Not Working
- Logout and login again to refresh token
- Check if admin has the required permission
- Verify permission middleware is applied on API routes

### Cannot See Admin Button
- Only super admins can see the Admins button
- Regular admins with MANAGE_ADMINS permission can also see it
- Check your permissions in the admin list

## Migration from Old System

If you have existing admins without roles:

1. Run the setup script to upgrade the first admin to super admin
2. Login as super admin
3. Delete and recreate other admins with appropriate permissions

## Support

For issues or questions:
- Check the console logs for detailed error messages
- Verify database connectivity
- Ensure all dependencies are installed
- Review this guide for common solutions

---

**Security Notice**: Keep your super admin credentials secure. Never commit them to version control. Change default passwords immediately in production.

