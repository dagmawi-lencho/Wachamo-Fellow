'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, UserPlus, Trash2, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Admin {
  _id: string;
  email: string;
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
    confirmPassword: ''
  });

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
          password: newAdmin.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Admin created successfully!');
        setNewAdmin({ email: '', password: '', confirmPassword: '' });
        setShowAddForm(false);
        fetchAdmins();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to create admin');
      }
    } catch (err) {
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
    } catch (err) {
      setError('An error occurred while deleting admin');
    }
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

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAdmin({ email: '', password: '', confirmPassword: '' });
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
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No administrators found
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin._id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{admin.email}</TableCell>
                      <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className="gradient-primary text-white">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                          disabled={admins.length <= 1}
                          title={admins.length <= 1 ? 'Cannot delete the last admin' : 'Delete admin'}
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
            <strong className="text-primary">Security Note:</strong> All admins have full access to the dashboard. 
            Only create admin accounts for trusted individuals. Passwords are encrypted using bcrypt.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

