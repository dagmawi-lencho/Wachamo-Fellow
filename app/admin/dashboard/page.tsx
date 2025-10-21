'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Users, UserPlus, BookOpen, 
  LogOut, Settings, Search,
  Edit, Trash2, Shield,
  Cross, Heart, GraduationCap,
  BarChart3, PieChart, Activity,
  Download, Filter, X,
  ChevronLeft, ChevronRight, ShoppingCart, CreditCard
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
import { PaymentSettingsDialog } from '@/components/PaymentSettingsDialog';
import { BankManagementDialog } from '@/components/BankManagementDialog';
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
    totalRevenue?: number;
    totalDonations?: number;
    totalSales?: number;
    pendingTransactions?: number;
    approvedTransactions?: number;
    rejectedTransactions?: number;
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
  const [transactions, setTransactions] = useState<Array<{
    _id: string;
    orderNumber?: string;
    type: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    amount: number;
    productName?: string;
    status: string;
    txRef: string;
    receiptUrl?: string;
    createdAt: string;
  }>>([]);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const [transactionStats, setTransactionStats] = useState<{
    totalRevenue: number;
    totalDonations: number;
    totalSales: number;
    successCount: number;
    pendingCount: number;
    failedCount: number;
  } | null>(null);
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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [bankToEdit, setBankToEdit] = useState<{
    _id?: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  } | undefined>(undefined);
  const [banks, setBanks] = useState<Array<{
    _id: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    isActive: boolean;
  }>>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fellowshipTeam: 'all',
    college: 'all',
    department: 'all',
    membershipStatus: 'all',
    sex: 'all',
    bornAgain: 'all',
    attendingBibleStudy: 'all',
    academicYear: 'all',
    alphabetFilter: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);

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
        fetchTransactions();
        fetchBanks();
      } else {
        // Token is invalid/expired - server has cleared the cookie
        // Force a hard redirect to login page with session expired message
        window.location.href = '/admin/login?session=expired';
      }
    } catch {
      // Network error or other issue - redirect to login
      window.location.href = '/admin/login';
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
      // Use hard redirect to ensure all state is cleared
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Redirect anyway to be safe
      window.location.href = '/admin/login';
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data.transactions || []);
      setTransactionStats(data.stats || null);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await fetch('/api/banks');
      const data = await response.json();
      setBanks(data || []);
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return;
    
    try {
      await fetch(`/api/banks/${bankId}`, { method: 'DELETE' });
      fetchBanks();
    } catch (error) {
      console.error('Failed to delete bank:', error);
    }
  };

  const handleTransactionAction = async (txId: string, status: 'approved' | 'rejected' | 'pending' | 'expired', reason?: string) => {
    try {
      const res = await fetch(`/api/transactions/${txId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: reason, approvedBy: status === 'approved' ? 'admin' : undefined })
      });

      if (res.ok) {
        fetchTransactions();
        fetchStats(); // Refresh stats to update revenue
      } else {
        alert('Failed to update transaction');
      }
    } catch (error) {
      console.error('Failed to update transaction:', error);
      alert('An error occurred');
    }
  };

  const exportTransactions = () => {
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(
        transactions.map((tx, index) => ({
          'No.': index + 1,
          'Order Number': tx.orderNumber || 'N/A',
          'Type': tx.type === 'donation' ? 'Donation' : 'Product Sale',
          'Amount (ETB)': tx.amount,
          'Customer Name': `${tx.firstName} ${tx.lastName}`,
          'Email': tx.email,
          'Phone': tx.phoneNumber,
          'Product': tx.productName || '-',
          'Status': tx.status,
          'Transaction Ref': tx.txRef,
          'Date': new Date(tx.createdAt).toLocaleString()
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

      const date = new Date().toISOString().split('T')[0];
      const filename = `Wachamo_Transactions_${date}.xlsx`;

      XLSX.writeFile(workbook, filename);
    });
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

  const filteredMembers = React.useMemo(() => {
    try {
      return (members || []).filter(member => {
        if (!member) return false;
        
        // Search filter - searches across multiple fields
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
          member.fullName?.toLowerCase().includes(searchLower) ||
          member.studentId?.toLowerCase().includes(searchLower) ||
          member.department?.toLowerCase().includes(searchLower) ||
          member.college?.toLowerCase().includes(searchLower) ||
          member.membershipStatus?.toLowerCase().includes(searchLower) ||
          member.fellowshipTeam?.toLowerCase().includes(searchLower) ||
          member.section?.toLowerCase().includes(searchLower) ||
          member.academicYear?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;

        // Alphabet filter
        if (filters.alphabetFilter && filters.alphabetFilter !== 'all') {
          const firstLetter = member.fullName?.[0]?.toLowerCase();
          if (firstLetter !== filters.alphabetFilter.toLowerCase()) return false;
        }

        // Apply all filters (skip if filter is "all" or empty)
        if (filters.fellowshipTeam && filters.fellowshipTeam !== 'all' && member.fellowshipTeam !== filters.fellowshipTeam) return false;
        if (filters.college && filters.college !== 'all' && member.college !== filters.college) return false;
        if (filters.department && filters.department !== 'all' && member.department !== filters.department) return false;
        if (filters.membershipStatus && filters.membershipStatus !== 'all' && member.membershipStatus !== filters.membershipStatus) return false;
        if (filters.sex && filters.sex !== 'all' && member.sex !== filters.sex) return false;
        if (filters.bornAgain && filters.bornAgain !== 'all' && member.bornAgain !== filters.bornAgain) return false;
        if (filters.attendingBibleStudy && filters.attendingBibleStudy !== 'all' && member.attendingBibleStudy !== filters.attendingBibleStudy) return false;
        if (filters.academicYear && filters.academicYear !== 'all' && member.academicYear !== filters.academicYear) return false;

        return true;
      });
    } catch (error) {
      console.error('Filter error:', error);
      return members || [];
    }
  }, [members, searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      fellowshipTeam: 'all',
      college: 'all',
      department: 'all',
      membershipStatus: 'all',
      sex: 'all',
      bornAgain: 'all',
      attendingBibleStudy: 'all',
      academicYear: 'all',
      alphabetFilter: 'all'
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'all');

  // Pagination for Members
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Pagination for Transactions
  const totalTransactionPages = Math.ceil(transactions.length / transactionsPerPage);
  const transactionStartIndex = (transactionPage - 1) * transactionsPerPage;
  const transactionEndIndex = transactionStartIndex + transactionsPerPage;
  const paginatedTransactions = transactions.slice(transactionStartIndex, transactionEndIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const exportToExcel = () => {
    // Dynamic import to avoid build issues
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredMembers.map((member, index) => ({
          'No.': index + 1,
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
              <div className="w-12 h-12 rounded-full bg-white p-2 border-2 border-primary relative">
                <Image 
                  src="/logo.png" 
                  alt="Wachamo Fellowship Logo" 
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Wachamo Fellowship Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/products')}
                className="border-2 hover:bg-orange-50 hover:border-orange-300"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Products</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(true)}
                className="border-2 hover:bg-green-50 hover:border-green-300"
                size="sm"
              >
                <CreditCard className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Payment</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAdminDialog(true)}
                className="border-2 hover:bg-purple-50 hover:border-purple-300"
                size="sm"
              >
                <Shield className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Admins</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettingsDialog(true)}
                className="border-2 hover:bg-primary/10"
                size="sm"
              >
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Registration</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 hover:bg-destructive/10 hover:text-destructive"
                size="sm"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 lg:w-[1000px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="banks" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Banks</span>
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

            {/* Revenue Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-2 border-green-500/20 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <CreditCard className="w-5 h-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {stats?.overview?.totalRevenue || 0} ETB
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      From approved payments
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-2 border-primary/20 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Donations</CardTitle>
                    <Heart className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {stats?.overview?.totalDonations || 0} ETB
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Generous contributions
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="border-2 border-secondary/20 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-amber-50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Product Sales</CardTitle>
                    <ShoppingCart className="w-5 h-5 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-secondary">
                      {stats?.overview?.totalSales || 0} ETB
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      From shop purchases
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
                        Manage all fellowship members • Showing {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} 
                        {filteredMembers.length !== members?.length && ` (filtered from ${members?.length || 0} total)`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
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
                      placeholder="Search by name, ID, department, college, team, status, year..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-xl rounded-2xl p-6 border border-primary/20 animate-in slide-in-from-top duration-300">
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

                      {/* Alphabet Filter */}
                      <div className="mb-4 pb-4 border-b border-primary/10">
                        <Label className="text-sm font-semibold mb-2 block">Filter by First Letter</Label>
                        <div className="flex flex-wrap gap-1">
                          <Button
                            variant={filters.alphabetFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilters({ ...filters, alphabetFilter: 'all' })}
                            className={filters.alphabetFilter === 'all' ? 'gradient-primary text-white' : ''}
                          >
                            All
                          </Button>
                          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                            <Button
                              key={letter}
                              variant={filters.alphabetFilter === letter ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setFilters({ ...filters, alphabetFilter: letter })}
                              className={filters.alphabetFilter === letter ? 'gradient-primary text-white' : 'hover:bg-primary/10'}
                            >
                              {letter}
                            </Button>
                          ))}
                        </div>
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
                              <SelectItem value="all">All Teams</SelectItem>
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
                              <SelectItem value="all">All Colleges</SelectItem>
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
                              <SelectItem value="all">All Statuses</SelectItem>
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
                              <SelectItem value="all">All</SelectItem>
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
                              <SelectItem value="all">All Years</SelectItem>
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
                              <SelectItem value="all">All</SelectItem>
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
                              <SelectItem value="all">All</SelectItem>
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
                            if (!value || value === 'all') return null;
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
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Pagination Controls - Top */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Show:</Label>
                    <Select value={itemsPerPage.toString()} onValueChange={(val) => {
                      setItemsPerPage(parseInt(val));
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-20 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">entries per page</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        <TableHead className="w-16">No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fellowship Team</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No members found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedMembers.map((member, index) => (
                        <TableRow key={member._id} className="hover:bg-primary/5">
                          <TableCell className="font-semibold text-gray-600">{startIndex + index + 1}</TableCell>
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
                      )))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls - Bottom */}
                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} entries
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? 'gradient-primary text-white' : ''}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Last
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Transaction Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {transactionStats?.totalRevenue || 0} ETB
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">All successful payments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {transactionStats?.totalDonations || 0} ETB
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">From generous donors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Product Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {transactionStats?.totalSales || 0} ETB
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">From shop purchases</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Successful Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {transactionStats?.successCount || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {transactionStats?.pendingCount || 0} pending • {transactionStats?.failedCount || 0} failed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      All payments and donations • Showing {transactionStartIndex + 1}-{Math.min(transactionEndIndex, transactions.length)} of {transactions.length}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={exportTransactions}
                    className="gradient-secondary text-white"
                    disabled={transactions.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Pagination Controls - Top */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Show:</Label>
                    <Select value={transactionsPerPage.toString()} onValueChange={(val) => {
                      setTransactionsPerPage(parseInt(val));
                      setTransactionPage(1);
                    }}>
                      <SelectTrigger className="w-20 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">entries per page</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(prev => Math.max(1, prev - 1))}
                      disabled={transactionPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      Page {transactionPage} of {totalTransactionPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(prev => Math.min(totalTransactionPages, prev + 1))}
                      disabled={transactionPage === totalTransactionPages || totalTransactionPages === 0}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        <TableHead className="w-12">No.</TableHead>
                        <TableHead className="min-w-[100px]">Order #</TableHead>
                        <TableHead className="min-w-[80px]">Type</TableHead>
                        <TableHead className="min-w-[150px]">Customer</TableHead>
                        <TableHead className="min-w-[120px]">Product</TableHead>
                        <TableHead className="min-w-[80px]">Amount</TableHead>
                        <TableHead className="min-w-[100px]">Receipt</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[180px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No transactions yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedTransactions.map((tx, index) => (
                          <TableRow key={tx._id} className="hover:bg-primary/5">
                            <TableCell className="font-semibold text-gray-600">{transactionStartIndex + index + 1}</TableCell>
                            <TableCell>
                              <span className="font-mono font-bold text-primary text-sm">
                                {tx.orderNumber || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={tx.type === 'donation' ? 'gradient-primary text-white' : 'gradient-secondary text-white'}>
                                {tx.type === 'donation' ? 'Donation' : 'Sale'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{tx.firstName} {tx.lastName}</p>
                                <p className="text-xs text-gray-600">{tx.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">{tx.productName || '-'}</TableCell>
                            <TableCell className="font-bold text-primary">{tx.amount} ETB</TableCell>
                            <TableCell>
                              {tx.receiptUrl ? (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setViewingReceipt(tx.receiptUrl || null)}
                                  className="text-xs"
                                >
                                  View Receipt
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-400">No receipt</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                tx.status === 'approved' ? 'default' : 
                                tx.status === 'pending' ? 'secondary' : 
                                'destructive'
                              } className={
                                tx.status === 'approved' ? 'bg-green-600' :
                                tx.status === 'pending' ? 'bg-orange-500' :
                                tx.status === 'expired' ? 'bg-gray-600' :
                                'bg-red-600'
                              }>
                                {tx.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="min-w-[180px]">
                              {tx.status === 'pending' ? (
                                <div className="flex gap-2 flex-nowrap">
                                  <Button
                                    size="sm"
                                    onClick={() => handleTransactionAction(tx._id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-3 whitespace-nowrap"
                                  >
                                    ✓ Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      const reason = prompt('Rejection reason (optional):');
                                      handleTransactionAction(tx._id, 'rejected', reason || undefined);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 px-3 whitespace-nowrap"
                                  >
                                    ✗ Reject
                                  </Button>
                                </div>
                              ) : tx.status === 'approved' ? (
                                <div className="flex gap-2 flex-nowrap">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      if (confirm('Are you sure you want to reject this approved transaction?')) {
                                        const reason = prompt('Rejection reason:');
                                        if (reason) {
                                          handleTransactionAction(tx._id, 'rejected', reason);
                                        }
                                      }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 px-3 whitespace-nowrap"
                                  >
                                    ✗ Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (confirm('Revert this transaction back to pending status?')) {
                                        handleTransactionAction(tx._id, 'pending');
                                      }
                                    }}
                                    className="border-orange-500 text-orange-600 hover:bg-orange-50 text-xs h-8 px-3 whitespace-nowrap"
                                  >
                                    ↺ Undo
                                  </Button>
                                </div>
                              ) : tx.status === 'rejected' || tx.status === 'expired' ? (
                                <div className="flex gap-2 flex-nowrap">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const message = tx.status === 'expired' 
                                        ? 'This order expired. Approve anyway?' 
                                        : 'Are you sure you want to approve this rejected transaction?';
                                      if (confirm(message)) {
                                        handleTransactionAction(tx._id, 'approved');
                                      }
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-3 whitespace-nowrap"
                                  >
                                    ✓ Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (confirm('Revert this transaction back to pending status?')) {
                                        handleTransactionAction(tx._id, 'pending');
                                      }
                                    }}
                                    className="border-orange-500 text-orange-600 hover:bg-orange-50 text-xs h-8 px-3 whitespace-nowrap"
                                  >
                                    ↺ Undo
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls - Bottom */}
                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {transactionStartIndex + 1} to {Math.min(transactionEndIndex, transactions.length)} of {transactions.length} entries
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(1)}
                      disabled={transactionPage === 1}
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(prev => Math.max(1, prev - 1))}
                      disabled={transactionPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalTransactionPages) }, (_, i) => {
                        let pageNum;
                        if (totalTransactionPages <= 5) {
                          pageNum = i + 1;
                        } else if (transactionPage <= 3) {
                          pageNum = i + 1;
                        } else if (transactionPage >= totalTransactionPages - 2) {
                          pageNum = totalTransactionPages - 4 + i;
                        } else {
                          pageNum = transactionPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={transactionPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTransactionPage(pageNum)}
                            className={transactionPage === pageNum ? 'gradient-primary text-white' : ''}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(prev => Math.min(totalTransactionPages, prev + 1))}
                      disabled={transactionPage === totalTransactionPages || totalTransactionPages === 0}
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(totalTransactionPages)}
                      disabled={transactionPage === totalTransactionPages || totalTransactionPages === 0}
                    >
                      Last
                    </Button>
                  </div>
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

          {/* Banks Tab */}
          <TabsContent value="banks" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Bank Accounts Management</CardTitle>
                  <CardDescription>Manage fellowship bank accounts for donations and payments</CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    setBankToEdit(undefined);
                    setShowBankDialog(true);
                  }}
                  className="gradient-primary text-white"
                >
                  + Add Bank
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank Name</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Account Holder</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No bank accounts added yet. Click &ldquo;Add Bank&rdquo; to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      banks.map((bank) => (
                        <TableRow key={bank._id}>
                          <TableCell className="font-semibold">{bank.bankName}</TableCell>
                          <TableCell className="font-mono">{bank.accountNumber}</TableCell>
                          <TableCell>{bank.accountHolderName}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setBankToEdit(bank);
                                setShowBankDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteBank(bank._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bank Management Dialog */}
      <BankManagementDialog
        bank={bankToEdit}
        open={showBankDialog}
        onOpenChange={setShowBankDialog}
        onSave={fetchBanks}
      />

      {/* Admin Management Dialog */}
      <AdminManagementDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
      />

      {/* Payment Settings Dialog */}
      <PaymentSettingsDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
      />

      {/* Receipt Viewer Dialog */}
      <Dialog open={!!viewingReceipt} onOpenChange={() => setViewingReceipt(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          {viewingReceipt && (
            <div className="relative w-full h-[600px]">
              <Image 
                src={viewingReceipt} 
                alt="Payment Receipt" 
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

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

