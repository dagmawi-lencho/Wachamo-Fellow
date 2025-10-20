'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, CreditCard, User, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { cartStore, CartItem } from '@/lib/cartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    studentId: ''
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');

  useEffect(() => {
    const items = cartStore.getCart();
    if (items.length === 0) {
      router.push('/shop');
    }
    setCart(items);
  }, [router]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

      if (!uploadData.success) {
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
          email: formData.email,
          firstName: formData.fullName.split(' ')[0] || formData.fullName,
          lastName: formData.fullName.split(' ').slice(1).join(' ') || formData.fullName,
          phoneNumber: formData.phoneNumber,
          type: 'product',
          productName: `Order (${cart.length} items)`,
          productId: cart.map(item => item.productId).join(','),
          orderDetails: cart
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Clear cart and redirect to Chapa
        cartStore.clearCart();
        window.location.href = data.checkoutUrl;
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
                    <Label htmlFor="email" className="text-base font-bold">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="dagmawi@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                          Submit Order - {total} ETB
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

