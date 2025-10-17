'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, UserPlus, BookOpen, 
  LogOut, Settings, Search,
  Edit, Trash2, Shield,
  Cross, Heart, GraduationCap,
  BarChart3, PieChart, Activity,
  Download, Filter, X
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
import { colleges } from '@/lib/academicData';
import { fellowshipTeams } from '@/lib/fellowshipTeams';
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fellowshipTeam: '',
    college: '',
    department: '',
    membershipStatus: '',
    sex: '',
    bornAgain: '',
    attendingBibleStudy: '',
    academicYear: ''
  });

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

  const filteredMembers = (members || []).filter(member => {
    // Search filter
    const matchesSearch = 
      member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.college?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Apply all filters
    if (filters.fellowshipTeam && member.fellowshipTeam !== filters.fellowshipTeam) return false;
    if (filters.college && member.college !== filters.college) return false;
    if (filters.department && member.department !== filters.department) return false;
    if (filters.membershipStatus && member.membershipStatus !== filters.membershipStatus) return false;
    if (filters.sex && member.sex !== filters.sex) return false;
    if (filters.bornAgain && member.bornAgain !== filters.bornAgain) return false;
    if (filters.attendingBibleStudy && member.attendingBibleStudy !== filters.attendingBibleStudy) return false;
    if (filters.academicYear && member.academicYear !== filters.academicYear) return false;

    return true;
  });

  const clearFilters = () => {
    setFilters({
      fellowshipTeam: '',
      college: '',
      department: '',
      membershipStatus: '',
      sex: '',
      bornAgain: '',
      attendingBibleStudy: '',
      academicYear: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const exportToExcel = () => {
    // Dynamic import to avoid build issues
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredMembers.map(member => ({
          'Full Name': member.fullName,
          'Sex': member.sex,
          'Age': member.age,
          'Phone Number': member.phoneNumber,
          'Student ID': member.studentId,
          'College': member.college,
          'Department': member.department,
          'Section': member.section,
          'Academic Year': member.academicYear,
          'Membership Status': member.membershipStatus,
          'Fellowship Team': member.fellowshipTeam,
          'Leadership Role': member.leadershipRole || '',
          'Bible Study': member.attendingBibleStudy,
          'Bible Study Role': member.bibleStudyRole || '',
          'Born Again': member.bornAgain,
          'Church Name': member.churchName,
          'Spiritual Gift': member.spiritualGift,
          'Favorite Bible Verse': member.favoriteBibleVerse,
          'Prayer Request': member.prayerRequest || '',
          'Registered Date': new Date(member.createdAt).toLocaleDateString()
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `Wachamo_Fellowship_Members_${date}.xlsx`;

      XLSX.writeFile(workbook, filename);
    });
  };

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
                      {stats?.overview?.totalMembers || 0}
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
                      {stats?.overview?.newMembers || 0}
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
                      {stats?.overview?.attendingBibleStudy || 0}
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
                      {stats?.overview?.bornAgainYes || 0}
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
                      <p className="text-2xl font-bold text-primary">{stats?.overview?.newMembers || 0}</p>
                      <p className="text-sm text-muted-foreground">New</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-secondary">{stats?.overview?.existingMembers || 0}</p>
                      <p className="text-sm text-muted-foreground">Existing</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats?.overview?.maleMembers || 0}</p>
                      <p className="text-sm text-muted-foreground">Male</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <p className="text-2xl font-bold text-pink-600">{stats?.overview?.femaleMembers || 0}</p>
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
                    {stats?.charts?.membersByDepartment.slice(0, 5).map((dept) => (
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
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Registered Members</CardTitle>
                      <CardDescription>
                        Manage all fellowship members • {filteredMembers.length} of {members?.length || 0} shown
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`border-2 ${hasActiveFilters ? 'border-primary bg-primary/10' : ''}`}
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
                      </Button>
                      <Button
                        onClick={exportToExcel}
                        className="gradient-secondary text-white"
                        disabled={filteredMembers.length === 0}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export to Excel
                      </Button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, student ID, department, or college..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-xl rounded-2xl p-6 border border-primary/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Filter className="w-5 h-5 text-primary" />
                          Advanced Filters
                        </h3>
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-primary hover:text-primary/80"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Clear All
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Fellowship Team Filter */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Fellowship Team</Label>
                          <Select
                            value={filters.fellowshipTeam}
                            onValueChange={(val) => setFilters({ ...filters, fellowshipTeam: val })}
                          >
                            <SelectTrigger className="bg-white/80">
                              <SelectValue placeholder="All teams" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Teams</SelectItem>
                              {fellowshipTeams.map((team) => (
                                <SelectItem key={team} value={team}>
                                  {team}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* College Filter */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">College</Label>
                          <Select
                            value={filters.college}
                            onValueChange={(val) => setFilters({ ...filters, college: val })}
                          >
                            <SelectTrigger className="bg-white/80">
                              <SelectValue placeholder="All colleges" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Colleges</SelectItem>
                              {colleges.map((college) => (
                                <SelectItem key={college} value={college}>
                                  {college}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Membership Status Filter */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Membership Status</Label>
                          <Select
                            value={filters.membershipStatus}
                            onValueChange={(val) => setFilters({ ...filters, membershipStatus: val })}
                          >
                            <SelectTrigger className="bg-white/80">
                              <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Statuses</SelectItem>
                              <SelectItem value="New Member">New Member</SelectItem>
                              <SelectItem value="Existing Member">Existing Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Sex Filter */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Sex</Label>
                          <Select
                            value={filters.sex}
                            onValueChange={(val) => setFilters({ ...filters, sex: val })}
                          >
                            <SelectTrigger className="bg-white/80">
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All</SelectItem>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Academic Year Filter */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Academic Year</Label>
                          <Select
                            value={filters.academicYear}
                            onValueChange={(val) => setFilters({ ...filters, academicYear: val })}
                          >
                            <SelectTrigger className="bg-white/80">
                              <SelectValue placeholder="All years" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Years</SelectItem>
                              <SelectItem value="1st Year">1st Year</SelectItem>
                              <SelectItem value="2nd Year">2nd Year</SelectItem>
                              <SelectItem value="3rd Year">3rd Year</SelectItem>
                              <SelectItem value="4th Year">4th Year</SelectItem>
                              <SelectItem value="5th Year">5th Year</SelectItem>
                              <SelectItem value="6th Year">6th Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Born Again Filter */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Born Again</Label>
                          <Select
                            value={filters.bornAgain}
                            onValueChange={(val) => setFilters({ ...filters, bornAgain: val })}
                          >
                            <SelectTrigger className="bg-white/80">
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All</SelectItem>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Bible Study Filter */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Bible Study</Label>
                          <Select
                            value={filters.attendingBibleStudy}
                            onValueChange={(val) => setFilters({ ...filters, attendingBibleStudy: val })}
                          >
                            <SelectTrigger className="bg-white/80">
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All</SelectItem>
                              <SelectItem value="Yes">Attending</SelectItem>
                              <SelectItem value="No">Not Attending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Active Filters Summary */}
                      {hasActiveFilters && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {Object.entries(filters).map(([key, value]) => {
                            if (!value) return null;
                            return (
                              <Badge
                                key={key}
                                className="gradient-primary text-white pr-1"
                              >
                                {value}
                                <button
                                  onClick={() => setFilters({ ...filters, [key]: '' })}
                                  className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
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
                    <BarChart data={stats?.charts?.membersByCollege || []}>
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
                        data={stats?.charts?.membersByYear || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry._id}: ${entry.count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats?.charts?.membersByYear.map((entry, idx) => (
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
                    <LineChart data={stats?.charts?.recentRegistrations || []}>
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
                    <BarChart data={stats?.charts?.fellowshipTeams || []}>
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
                value={registrationSettings.isOpen !== undefined ? registrationSettings.isOpen.toString() : 'true'}
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

