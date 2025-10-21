'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Package, Search, ArrowLeft, CheckCircle2, Clock, XCircle, 
  User, CreditCard, Calendar, FileText, ShoppingCart 
} from 'lucide-react';

interface OrderData {
  orderNumber: string;
  amount: number;
  currency: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  studentId: string;
  bankName?: string;
  accountNumber?: string;
  type: string;
  productName?: string;
  orderDetails?: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TrackOrderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orderNumber: '',
    studentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(
        `/api/track-order?orderNumber=${formData.orderNumber}&studentId=${formData.studentId}`
      );
      
      const data = await response.json();

      if (response.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch {
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-5 h-5" />;
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b-2 border-primary/20 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Track Your Order
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">Check your order status</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="border-2 border-primary/30 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-6 h-6 text-primary" />
                Enter Order Details
              </CardTitle>
              <CardDescription>
                Track your order using your order number and student ID
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber" className="text-base font-bold">
                      Order Number *
                    </Label>
                    <Input
                      id="orderNumber"
                      placeholder="e.g., WCU1234567"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value.toUpperCase() })}
                      required
                      className="h-12 font-mono text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-base font-bold">
                      Student ID *
                    </Label>
                    <Input
                      id="studentId"
                      placeholder="e.g., WCU174538"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg font-bold"
                  style={{ background: 'linear-gradient(to right, #2ea7df, #f59f45)' }}
                >
                  {loading ? (
                    <span className="animate-pulse">Searching...</span>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 space-y-6"
          >
            {/* Status Banner */}
            <Card className={`border-2 ${getStatusColor(order.status)}/20 shadow-xl overflow-hidden`}>
              <div className={`${getStatusColor(order.status)} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="text-sm font-medium opacity-90">Order Status</p>
                      <p className="text-2xl font-bold uppercase">{order.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-90">Order Number</p>
                    <p className="text-xl font-mono font-bold">{order.orderNumber}</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-4">
                {order.status === 'pending' && (
                  <p className="text-sm text-gray-700">
                    ⏳ Your order is being reviewed by our admin team. You will be notified within 24 hours.
                  </p>
                )}
                {order.status === 'approved' && (
                  <p className="text-sm text-green-700">
                    ✅ Your order has been approved! {order.approvedAt && `Approved on ${new Date(order.approvedAt).toLocaleDateString()}`}
                  </p>
                )}
                {order.status === 'rejected' && order.rejectionReason && (
                  <div className="text-sm text-red-700">
                    <p className="font-bold mb-1">❌ Order Rejected</p>
                    <p>Reason: {order.rejectionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold">{order.firstName} {order.lastName}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Student ID:</span>
                    <span className="font-semibold font-mono">{order.studentId}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{order.phoneNumber}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card className="border-2 border-secondary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-secondary" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-2xl text-primary">{order.amount} {order.currency}</span>
                  </div>
                  <Separator />
                  {order.bankName && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-semibold">{order.bankName}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <Badge className={order.type === 'donation' ? 'bg-primary' : 'bg-secondary'}>
                      {order.type === 'donation' ? 'Donation' : 'Purchase'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            {order.orderDetails && order.orderDetails.length > 0 && (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {order.orderDetails.map((item, index: number) => (
                      <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                          {item.imageUrl ? (
                            <Image 
                              src={item.imageUrl} 
                              alt={item.name} 
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded-lg" 
                            />
                          ) : (
                            <Package className="w-8 h-8 text-primary/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm font-bold text-primary">{item.price} ETB each</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-secondary">
                            {item.price * item.quantity} ETB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Amount:</span>
                    <span className="text-3xl font-bold text-primary">{order.amount} ETB</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Single Product/Donation */}
            {!order.orderDetails && order.productName && (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {order.type === 'donation' ? 'Donation Details' : 'Product Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{order.productName}</span>
                    <span className="text-2xl font-bold text-primary">{order.amount} ETB</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Receipt */}
            {order.receiptUrl && (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Payment Receipt
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <Image 
                      src={order.receiptUrl} 
                      alt="Payment Receipt" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Button
                    onClick={() => window.open(order.receiptUrl, '_blank')}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    View Full Receipt
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                        ✓
                      </div>
                      <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold">Order Placed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full ${
                        order.status !== 'pending' ? 'bg-green-500' : 'bg-yellow-500'
                      } flex items-center justify-center text-white`}>
                        {order.status !== 'pending' ? '✓' : '⏳'}
                      </div>
                      {order.status === 'approved' && (
                        <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {order.status === 'pending' ? 'Under Review' : order.status === 'approved' ? 'Approved' : 'Reviewed'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.status === 'pending' 
                          ? 'Waiting for admin verification' 
                          : `Updated: ${new Date(order.updatedAt).toLocaleString()}`
                        }
                      </p>
                    </div>
                  </div>

                  {order.status === 'approved' && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                          ✓
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">Completed</p>
                        <p className="text-sm text-gray-600">
                          Your order has been processed successfully
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Track Another Order */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setOrder(null);
                  setFormData({ orderNumber: '', studentId: '' });
                  setError('');
                }}
                variant="outline"
                className="border-2"
              >
                Track Another Order
              </Button>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        {!order && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card className="border border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  How to Track Your Order
                </h3>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Enter your <strong>10-digit order number</strong> (starts with WCU)</li>
                  <li>Enter your <strong>student ID</strong> used during purchase</li>
                  <li>Click <strong>&ldquo;Track Order&rdquo;</strong> to view your order status</li>
                  <li>You can track orders from both the shop and donations</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-gray-700">
                    💡 <strong>Tip:</strong> Your order number was sent to you on the success page after placing your order.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

