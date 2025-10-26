'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, UserPlus, Trash2, AlertCircle, Check, Crown, Settings as SettingsIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PERMISSION_GROUPS, Permission, Role } from '@/lib/permissions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Admin {
  _id: string;
  email: string;
  role: Role;
  permissions: Permission[];
  createdAt: string;
}

interface AdminManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminManagementDialog({ open, onOpenChange }: AdminManagementDialogProps) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' as Role,
    permissions: [] as Permission[]
  });
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAdmins();
    }
  }, [open]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins');
      const data = await response.json();
      setAdmins(data.admins || []);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!newAdmin.email || !newAdmin.password || !newAdmin.confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newAdmin.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newAdmin.email,
          password: newAdmin.password,
          role: newAdmin.role,
          permissions: newAdmin.permissions
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Admin created successfully!');
        setNewAdmin({ email: '', password: '', confirmPassword: '', role: 'admin', permissions: [] });
        setShowAddForm(false);
        setShowPermissions(false);
        fetchAdmins();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to create admin');
      }
    } catch {
      setError('An error occurred while creating admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete admin: ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Admin deleted successfully!');
        fetchAdmins();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete admin');
      }
    } catch {
      setError('An error occurred while deleting admin');
    }
  };

  const togglePermission = (permission: Permission) => {
    setNewAdmin(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const selectAllPermissions = () => {
    const allPermissions = Object.values(PERMISSION_GROUPS).flatMap(group => 
      group.map(p => p.id)
    );
    setNewAdmin(prev => ({ ...prev, permissions: allPermissions }));
  };

  const deselectAllPermissions = () => {
    setNewAdmin(prev => ({ ...prev, permissions: [] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Admin Management
          </DialogTitle>
          <DialogDescription>
            Manage administrator accounts. Add new admins or remove existing ones.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Add New Admin Form */}
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full gradient-primary text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        ) : (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Add New Administrator
              </CardTitle>
              <CardDescription>Create a new admin account with email and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="e.g., admin@wachamo.edu.et"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <Input
                      type="password"
                      placeholder="Min. 6 characters"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password *</Label>
                    <Input
                      type="password"
                      placeholder="Re-enter password"
                      value={newAdmin.confirmPassword}
                      onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Permission Management Section */}
                <div className="border-2 border-primary/20 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-bold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      Permission Settings
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={selectAllPermissions}
                        className="text-xs"
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={deselectAllPermissions}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(PERMISSION_GROUPS).map(([groupName, permissions]) => (
                      <AccordionItem key={groupName} value={groupName}>
                        <AccordionTrigger className="text-sm font-semibold">
                          {groupName} ({permissions.filter(p => newAdmin.permissions.includes(p.id)).length}/{permissions.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-3 p-2 rounded hover:bg-white/50">
                                <Checkbox
                                  id={permission.id}
                                  checked={newAdmin.permissions.includes(permission.id)}
                                  onCheckedChange={() => togglePermission(permission.id)}
                                />
                                <div className="flex-1">
                                  <label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {permission.label}
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                    <strong>Note:</strong> Super Admins automatically have all permissions and can manage other admins.
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAdmin({ email: '', password: '', confirmPassword: '', role: 'admin', permissions: [] });
                      setShowPermissions(false);
                      setError('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 gradient-secondary text-white"
                  >
                    {isLoading ? 'Creating...' : 'Create Admin'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Current Admins List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Current Administrators
          </h3>

          <div className="rounded-lg border-2 border-primary/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No administrators found
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin._id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{admin.email}</TableCell>
                      <TableCell>
                        {admin.role === 'super_admin' ? (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex items-center gap-1 w-fit">
                            <Crown className="w-3 h-3" />
                            Super Admin
                          </Badge>
                        ) : (
                          <Badge className="gradient-primary text-white">
                            Admin
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {admin.role === 'super_admin' ? 'All' : `${admin.permissions?.length || 0} granted`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                          disabled={admins.length <= 1 || admin.role === 'super_admin'}
                          title={
                            admin.role === 'super_admin' 
                              ? 'Cannot delete super admin' 
                              : admins.length <= 1 
                              ? 'Cannot delete the last admin' 
                              : 'Delete admin'
                          }
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {admins.length === 1 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              You cannot delete the last administrator account
            </p>
          )}
        </div>

        <div className="bg-blue-50/50 backdrop-blur-xl rounded-xl p-4 border border-primary/20">
          <p className="text-xs text-gray-600">
            <strong className="text-primary">Security Note:</strong> Admins have access based on granted permissions. 
            Super Admins have all permissions and can manage other admins. Regular admins can only access features you grant them.
            Passwords are encrypted using bcrypt.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

