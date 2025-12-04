'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, CreditCard, User, ArrowLeft, Building2, Copy, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { cartStore, CartItem } from '@/lib/cartStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Bank {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    studentId: ''
  });
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [firstPaymentAmount, setFirstPaymentAmount] = useState<number>(0);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const items = cartStore.getCart();
    if (items.length === 0) {
      router.push('/shop');
    }
    setCart(items);
    
    // Fetch available banks
    fetch('/api/banks')
      .then(res => res.json())
      .then(data => {
        setBanks(data);
        if (data.length > 0) {
          setSelectedBank(data[0]);
        }
      })
      .catch(console.error);
  }, [router]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remainingAmount = paymentType === 'partial' && firstPaymentAmount > 0
    ? Math.max(0, total - firstPaymentAmount)
    : 0;
  const donationAmount = paymentType === 'partial' && firstPaymentAmount > total
    ? firstPaymentAmount - total
    : 0;

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiptFile) {
      alert('Please upload your payment receipt');
      return;
    }

    if (paymentType === 'partial') {
      if (firstPaymentAmount <= 0) {
        alert('Please enter a valid first payment amount');
        return;
      }
      if (firstPaymentAmount >= total) {
        alert('For partial payment, first payment must be less than total amount. If paying full amount, please select "Full Payment" instead.');
        return;
      }
    }

    setProcessing(true);

    try {
      // Upload receipt to Cloudinary
      const uploadForm = new FormData();
      uploadForm.append('receipt', receiptFile);

      const uploadRes = await fetch('/api/upload-receipt', {
        method: 'POST',
        body: uploadForm
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success || !uploadData.url) {
        alert('Failed to upload receipt. Please try again.');
        setProcessing(false);
        return;
      }

      // Create transaction with receipt
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          firstName: formData.fullName.split(' ')[0] || formData.fullName,
          lastName: formData.fullName.split(' ').slice(1).join(' ') || formData.fullName,
          phoneNumber: formData.phoneNumber,
          studentId: formData.studentId,
          bankName: selectedBank?.bankName,
          accountNumber: selectedBank?.accountNumber,
          type: 'product',
          productName: `Order (${cart.length} items)`,
          productId: cart.map(item => item.productId).join(','),
          orderDetails: cart,
          receiptUrl: uploadData.url,
          paymentType: paymentType,
          firstPaymentAmount: paymentType === 'partial' ? firstPaymentAmount : undefined,
          remainingAmount: paymentType === 'partial' ? (donationAmount > 0 ? 0 : remainingAmount) : undefined,
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart and redirect to success page
        cartStore.clearCart();
        router.push(`/payment/success?tx_ref=${data.txRef}&order_number=${data.orderNumber}&status=pending&type=product`);
      } else {
        alert(data.error || 'Failed to process checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="w-12 h-12 object-contain" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Checkout
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.push('/cart')} className="border-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="border border-white/40 bg-white/95 backdrop-blur-xl shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Your Information
                </CardTitle>
                <CardDescription>We need this information to process your order</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCheckout} className="space-y-5">
                  <div className="grid gap-3">
                    <Label htmlFor="fullName" className="text-base font-bold">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="e.g., Dagmawi Lencho"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="studentId" className="text-base font-bold">Student ID *</Label>
                    <Input
                      id="studentId"
                      placeholder="e.g., WCU174538"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="phone" className="text-base font-bold">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0909090909"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Bank Selection */}
                  <div className="grid gap-3">
                    <Label className="text-base font-bold flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      Select Bank to Transfer To *
                    </Label>
                    <Select
                      value={selectedBank?._id || ''}
                      onValueChange={(value) => {
                        const bank = banks.find(b => b._id === value);
                        setSelectedBank(bank || null);
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose a bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank._id} value={bank._id}>
                            {bank.bankName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Display Account Details */}
                    {selectedBank && (
                      <div className="mt-2 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          📋 Transfer to this account:
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Bank:</span>
                            <span className="font-bold text-primary">{selectedBank.bankName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Account Holder:</span>
                            <span className="font-semibold">{selectedBank.accountHolderName}</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/50 p-2 rounded">
                            <div>
                              <span className="text-xs text-gray-600 block">Account Number:</span>
                              <span className="font-mono font-bold text-lg">{selectedBank.accountNumber}</span>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(selectedBank.accountNumber)}
                              className="ml-2"
                            >
                              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-center text-gray-600 mt-3 italic">
                          💡 Copy the account number and make your transfer, then upload the receipt below
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Type Selection */}
                  <div className="grid gap-3">
                    <Label className="text-base font-bold">Payment Type *</Label>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="full"
                          checked={paymentType === 'full'}
                          onCheckedChange={() => {
                            setPaymentType('full');
                            setFirstPaymentAmount(0);
                          }}
                        />
                        <Label htmlFor="full" className="cursor-pointer font-normal">Full Payment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="partial"
                          checked={paymentType === 'partial'}
                          onCheckedChange={() => {
                            setPaymentType('partial');
                            setFirstPaymentAmount(0);
                          }}
                        />
                        <Label htmlFor="partial" className="cursor-pointer font-normal">Partial Payment</Label>
                      </div>
                    </div>

                    {paymentType === 'partial' && (
                      <div className="mt-2 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200">
                        <div className="grid gap-2">
                          <Label htmlFor="firstPaymentAmount" className="text-sm font-semibold">
                            First Payment Amount (ETB) *
                          </Label>
                          <Input
                            id="firstPaymentAmount"
                            type="number"
                            min={0}
                            max={total - 0.01}
                            step="0.01"
                            value={firstPaymentAmount || ''}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= total) {
                                setFirstPaymentAmount(total - 0.01);
                              } else {
                                setFirstPaymentAmount(value);
                              }
                            }}
                            placeholder="Enter first payment amount"
                            className="h-12"
                          />
                          {firstPaymentAmount > 0 && (
                            <div className="mt-2 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-bold">{total} ETB</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">First Payment:</span>
                                <span className="font-bold text-green-600">{firstPaymentAmount} ETB</span>
                              </div>
                              {donationAmount > 0 ? (
                                <div className="flex justify-between border-t pt-1">
                                  <span className="text-gray-700 font-semibold">Remaining:</span>
                                  <span className="font-bold text-green-600">0 ETB</span>
                                </div>
                              ) : (
                                <div className="flex justify-between border-t pt-1">
                                  <span className="text-gray-700 font-semibold">Remaining:</span>
                                  <span className="font-bold text-orange-600">{remainingAmount} ETB</span>
                                </div>
                              )}
                              {donationAmount > 0 && (
                                <div className="mt-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                  <p className="text-xs text-green-700 font-semibold">
                                    💝 Thank you! The extra {donationAmount} ETB will be treated as a donation to the fellowship.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-gray-600 mt-2">
                            💡 You can pay the remaining amount later. Admin will track both payments.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="receipt" className="text-base font-bold">Payment Receipt * 📸</Label>
                    <div className="space-y-3">
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptChange}
                        required
                        className="h-12"
                      />
                      {receiptPreview && (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-primary/20">
                          <Image 
                            src={receiptPreview} 
                            alt="Receipt preview" 
                            fill 
                            className="object-contain bg-gray-50"
                          />
                        </div>
                      )}
                      <p className="text-xs text-gray-600">
                        📱 Upload screenshot of your bank transfer, mobile money receipt, or payment confirmation
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={processing}
                      className="w-full h-16 gradient-secondary text-white font-bold text-lg shadow-xl hover:shadow-2xl"
                    >
                      {processing ? (
                        <span className="animate-pulse">Uploading Receipt...</span>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          {paymentType === 'partial' && firstPaymentAmount > 0
                            ? donationAmount > 0
                              ? `Submit Order - ${firstPaymentAmount} ETB (${donationAmount} ETB donation)`
                              : `Submit Order - ${firstPaymentAmount} ETB (${remainingAmount} ETB remaining)`
                            : `Submit Order - ${total} ETB`}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-center text-gray-600 mt-3">
                      ✅ Your order will be verified by admin within 24 hours
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border border-primary/20 bg-white/95 backdrop-blur-xl shadow-xl sticky top-24">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center shrink-0 relative">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-lg" />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-primary/40" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary">{item.price * item.quantity} ETB</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{total} ETB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-semibold">0 ETB</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-bold text-primary">{total} ETB</span>
                </div>

                <div className="bg-blue-50/50 rounded-lg p-3 text-xs text-gray-700">
                  <p className="font-semibold mb-1">✓ Secure Payment</p>
                  <p>Your payment info is encrypted and secure</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

