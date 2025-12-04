'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
};

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void | Promise<void>;
}

export default function ManualSaleDialog({ open, onOpenChange, onSaved }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    studentId: '',
    paymentType: 'full' as 'full' | 'partial',
    firstPaymentAmount: 0,
    receiptFile: null as File | null,
    receiptPreview: '',
  });
  const [saving, setSaving] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (open) {
      fetchProducts();
      // Reset form when dialog opens
      setForm({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        studentId: '',
        paymentType: 'full',
        firstPaymentAmount: 0,
        receiptFile: null,
        receiptPreview: '',
      });
      setSelectedProducts([]);
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addProduct = (product: Product) => {
    const existing = selectedProducts.find(item => item.productId === product._id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedProducts([...selectedProducts, {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
      }]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts(selectedProducts.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, receiptFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, receiptFile: file, receiptPreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const total = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remainingAmount = form.paymentType === 'partial' && form.firstPaymentAmount > 0
    ? Math.max(0, total - form.firstPaymentAmount)
    : 0;
  const donationAmount = form.paymentType === 'partial' && form.firstPaymentAmount > total
    ? form.firstPaymentAmount - total
    : 0;

  const save = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    if (!form.firstName || !form.phoneNumber) {
      alert('Please fill in customer name and phone number');
      return;
    }

    if (form.paymentType === 'partial' && form.firstPaymentAmount <= 0) {
      alert('Please enter a valid first payment amount');
      return;
    }

    if (form.paymentType === 'partial' && form.firstPaymentAmount >= total) {
      alert('For partial payment, first payment must be less than total amount. If paying full amount, please select "Full Payment" instead.');
      return;
    }

    try {
      setSaving(true);

      // Upload receipt if provided
      let receiptUrl = '';
      if (form.receiptFile) {
        const uploadForm = new FormData();
        uploadForm.append('receipt', form.receiptFile);

        const uploadRes = await fetch('/api/upload-receipt', {
          method: 'POST',
          body: uploadForm
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success || !uploadData.url) {
          alert('Failed to upload receipt. Please try again.');
          setSaving(false);
          return;
        }
        receiptUrl = uploadData.url;
      }

      // Create manual transaction
      const response = await fetch('/api/transactions/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName || form.firstName,
          phoneNumber: form.phoneNumber,
          studentId: form.studentId || undefined,
          amount: total,
          paymentType: form.paymentType,
          firstPaymentAmount: form.paymentType === 'partial' ? form.firstPaymentAmount : undefined,
          remainingAmount: form.paymentType === 'partial' ? (donationAmount > 0 ? 0 : remainingAmount) : undefined,
          type: 'product',
          productName: `Manual Sale (${selectedProducts.length} items)`,
          orderDetails: selectedProducts,
          receiptUrl: receiptUrl || undefined,
          isManualEntry: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await onSaved();
        onOpenChange(false);
      } else {
        alert(data.error || 'Failed to create manual sale');
      }
    } catch (error) {
      console.error('Manual sale error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 -mx-6 -mt-6 px-6 py-4 mb-4 rounded-t-2xl">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            Add Manual Sale (In-Person)
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          {/* Customer Information */}
          <div className="border-b pb-4">
            <h3 className="font-bold text-lg mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Customer first name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Customer last name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  placeholder="0912345678"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="border-b pb-4">
            <h3 className="font-bold text-lg mb-3">Select Products</h3>
            {loadingProducts ? (
              <p className="text-gray-500">Loading products...</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {products.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.price} ETB • Stock: {product.stock}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addProduct(product)}
                      disabled={product.stock === 0}
                      className="ml-2"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Selected Products:</h4>
                {selectedProducts.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.price} ETB × {item.quantity} = {item.price * item.quantity} ETB</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeProduct(item.productId)}
                        className="ml-2 text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-2 p-2 bg-primary/10 rounded">
                  <p className="font-bold text-lg">Total: {total} ETB</p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Type */}
          <div className="border-b pb-4">
            <h3 className="font-bold text-lg mb-3">Payment Type</h3>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="full"
                  checked={form.paymentType === 'full'}
                  onCheckedChange={() => setForm({ ...form, paymentType: 'full', firstPaymentAmount: 0 })}
                />
                <Label htmlFor="full" className="cursor-pointer">Full Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="partial"
                  checked={form.paymentType === 'partial'}
                  onCheckedChange={() => setForm({ ...form, paymentType: 'partial', firstPaymentAmount: 0 })}
                />
                <Label htmlFor="partial" className="cursor-pointer">Partial Payment</Label>
              </div>
            </div>

            {form.paymentType === 'partial' && (
              <div className="grid gap-2">
                <Label htmlFor="firstPaymentAmount">First Payment Amount (ETB) *</Label>
                          <Input
                            id="firstPaymentAmount"
                            type="number"
                            min={0}
                            max={total - 0.01}
                            step="0.01"
                            value={form.firstPaymentAmount || ''}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= total) {
                                setForm({ ...form, firstPaymentAmount: total - 0.01 });
                              } else {
                                setForm({ ...form, firstPaymentAmount: value });
                              }
                            }}
                            placeholder="Enter first payment amount"
                          />
                {form.firstPaymentAmount > 0 && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>First Payment: {form.firstPaymentAmount} ETB</p>
                    {donationAmount > 0 ? (
                      <>
                        <p>Remaining: <span className="font-bold text-green-600">0 ETB</span></p>
                        <div className="mt-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 font-semibold">
                            💝 Extra {donationAmount} ETB will be treated as a donation to the fellowship.
                          </p>
                        </div>
                      </>
                    ) : (
                      <p>Remaining: <span className="font-bold text-orange-600">{remainingAmount} ETB</span></p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Receipt Upload */}
          <div>
            <h3 className="font-bold text-lg mb-3">Receipt (Optional)</h3>
            <div className="grid gap-2">
              <Label htmlFor="receipt">Upload Receipt Image</Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleReceiptChange}
              />
              {form.receiptPreview && (
                <div className="mt-2 relative w-full max-w-xs h-48 rounded border overflow-hidden">
                  <Image src={form.receiptPreview} alt="Receipt preview" fill className="object-contain" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white px-8 h-12 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              onClick={save}
              disabled={saving || selectedProducts.length === 0}
            >
              {saving ? (
                <span className="animate-pulse">Creating Sale...</span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Create Manual Sale
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

