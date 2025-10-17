'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, UserPlus, BookOpen, 
  LogOut, Settings, Search,
  Edit, Trash2, Shield,
  Cross, Heart, GraduationCap,
  BarChart3, PieChart, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditMemberDialog } from '@/components/EditMemberDialog';
import { AdminManagementDialog } from '@/components/AdminManagementDialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import type { Member } from '@/types/member';

interface Stats {
  overview: {
    totalMembers: number;
    newMembers: number;
    existingMembers: number;
    maleMembers: number;
    femaleMembers: number;
    bornAgainYes: number;
    bornAgainNo: number;
    attendingBibleStudy: number;
    notAttendingBibleStudy: number;
  };
  charts: {
    membersByCollege: Array<{ _id: string; count: number }>;
    membersByDepartment: Array<{ _id: string; count: number }>;
    membersByYear: Array<{ _id: string; count: number }>;
    recentRegistrations: Array<{ _id: string; count: number }>;
    fellowshipTeams: Array<{ _id: string; count: number }>;
  };
}

const COLORS = ['#2ea7df', '#f59f45', '#10b981', '#f97316', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [registrationSettings, setRegistrationSettings] = useState({
    isOpen: true,
    startDate: '',
    endDate: ''
  });
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
        fetchStats();
        fetchMembers();
        fetchRegistrationSettings();
      } else {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members?limit=100');
      const data = await response.json();
      setMembers(data.members);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const fetchRegistrationSettings = async () => {
    try {
      const response = await fetch('/api/registration-status');
      const data = await response.json();
      setRegistrationSettings({
        isOpen: data.isOpen,
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      console.error('Failed to fetch registration settings:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      const response = await fetch(`/api/members/${memberToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchMembers();
        fetchStats();
        setShowDeleteDialog(false);
        setMemberToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  const handleSaveRegistrationSettings = async () => {
    try {
      const response = await fetch('/api/registration-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isOpen: registrationSettings.isOpen,
          startDate: registrationSettings.startDate ? new Date(registrationSettings.startDate) : null,
          endDate: registrationSettings.endDate ? new Date(registrationSettings.endDate) : null
        })
      });

      if (response.ok) {
        setShowSettingsDialog(false);
        fetchRegistrationSettings();
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const filteredMembers = (members || []).filter(member =>
    member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-spiritual">
        <div className="text-center">
          <Cross className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-2 border-2 border-primary">
                <img 
                  src="/logo.png" 
                  alt="Wachamo Fellowship Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Wachamo Fellowship Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAdminDialog(true)}
                className="border-2 hover:bg-purple-50 hover:border-purple-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Manage Admins</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettingsDialog(true)}
                className="border-2 hover:bg-primary/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Registration</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-2 border-primary/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {stats?.overview.totalMembers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All registered members
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 border-secondary/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">New Members</CardTitle>
                    <UserPlus className="w-5 h-5 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-secondary">
                      {stats?.overview.newMembers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recently joined
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-2 border-green-500/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Bible Study</CardTitle>
                    <BookOpen className="w-5 h-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">
                      {stats?.overview.attendingBibleStudy || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Attending classes
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-2 border-purple-500/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Born Again</CardTitle>
                    <Heart className="w-5 h-5 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-500">
                      {stats?.overview.bornAgainYes || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Believers
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    Membership Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{stats?.overview.newMembers || 0}</p>
                      <p className="text-sm text-muted-foreground">New</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-secondary">{stats?.overview.existingMembers || 0}</p>
                      <p className="text-sm text-muted-foreground">Existing</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats?.overview.maleMembers || 0}</p>
                      <p className="text-sm text-muted-foreground">Male</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <p className="text-2xl font-bold text-pink-600">{stats?.overview.femaleMembers || 0}</p>
                      <p className="text-sm text-muted-foreground">Female</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Top Departments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.charts.membersByDepartment.slice(0, 5).map((dept) => (
                      <div key={dept._id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept._id}</span>
                        <Badge className="gradient-primary text-white">{dept.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Registered Members</CardTitle>
                    <CardDescription>Manage all fellowship members</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        <TableHead>Name</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fellowship Team</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member._id} className="hover:bg-primary/5">
                          <TableCell className="font-medium">{member.fullName}</TableCell>
                          <TableCell>{member.studentId}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                member.membershipStatus === 'New Member'
                                  ? 'gradient-secondary text-white'
                                  : 'gradient-primary text-white'
                              }
                            >
                              {member.membershipStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.fellowshipTeam}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setMemberToEdit(member);
                                  setShowEditDialog(true);
                                }}
                                className="hover:bg-primary/10 hover:border-primary"
                                title="Edit Member"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedMember(member);
                                  setShowMemberDialog(true);
                                }}
                                className="hover:bg-blue-50"
                                title="View Details"
                              >
                                👁️
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => {
                                  setMemberToDelete(member._id);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Members by College Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Members by College</CardTitle>
                  <CardDescription>Distribution across colleges</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats?.charts.membersByCollege || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2ea7df" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Academic Year Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Year Distribution</CardTitle>
                  <CardDescription>Members by year of study</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={stats?.charts.membersByYear || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry._id}: ${entry.count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats?.charts.membersByYear.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Registrations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Registrations</CardTitle>
                  <CardDescription>Last 7 days activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats?.charts.recentRegistrations || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#2ea7df" 
                        strokeWidth={3}
                        name="Registrations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Fellowship Teams */}
              <Card>
                <CardHeader>
                  <CardTitle>Fellowship Teams</CardTitle>
                  <CardDescription>Members by team</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats?.charts.fellowshipTeams || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59f45" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Admin Management Dialog */}
      <AdminManagementDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
      />

      {/* Edit Member Dialog */}
      <EditMemberDialog
        member={memberToEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={() => {
          fetchMembers();
          fetchStats();
        }}
      />

      {/* Member Details Dialog (View Only) */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>View complete member information</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Full Name</p>
                <p className="text-base">{selectedMember.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Student ID</p>
                <p className="text-base">{selectedMember.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Sex</p>
                <p className="text-base">{selectedMember.sex}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Age</p>
                <p className="text-base">{selectedMember.age}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Phone</p>
                <p className="text-base">{selectedMember.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">College</p>
                <p className="text-base">{selectedMember.college}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Department</p>
                <p className="text-base">{selectedMember.department}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Membership Status</p>
                <Badge className="gradient-primary text-white">{selectedMember.membershipStatus}</Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Fellowship Team</p>
                <p className="text-base">{selectedMember.fellowshipTeam}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Born Again</p>
                <p className="text-base">{selectedMember.bornAgain}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Bible Study</p>
                <p className="text-base">{selectedMember.attendingBibleStudy}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Registered</p>
                <p className="text-base">{new Date(selectedMember.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Settings</DialogTitle>
            <DialogDescription>
              Control when members can register for the fellowship
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Registration Status</Label>
              <Select
                value={registrationSettings.isOpen.toString()}
                onValueChange={(val) =>
                  setRegistrationSettings({ ...registrationSettings, isOpen: val === 'true' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Open</SelectItem>
                  <SelectItem value="false">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date (Optional)</Label>
              <Input
                type="date"
                value={registrationSettings.startDate}
                onChange={(e) =>
                  setRegistrationSettings({ ...registrationSettings, startDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Input
                type="date"
                value={registrationSettings.endDate}
                onChange={(e) =>
                  setRegistrationSettings({ ...registrationSettings, endDate: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-white" onClick={handleSaveRegistrationSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

