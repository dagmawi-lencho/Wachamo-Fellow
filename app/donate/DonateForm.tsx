'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export function DonateForm() {
  const [formData, setFormData] = useState({
    amount: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);

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

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiptFile) {
      alert('Please upload your payment receipt');
      return;
    }

    setProcessing(true);

    try {
      // Upload receipt
      const uploadForm = new FormData();
      uploadForm.append('receipt', receiptFile);

      const uploadRes = await fetch('/api/upload-receipt', {
        method: 'POST',
        body: uploadForm
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        alert('Failed to upload receipt');
        setProcessing(false);
        return;
      }

      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          type: 'donation',
          productName: 'Fellowship Donation',
          receiptUrl: uploadData.url
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Donation submitted! Admin will verify your payment within 24 hours.');
        // Reset form
        setFormData({ amount: '', firstName: '', lastName: '', email: '', phoneNumber: '' });
        setReceiptFile(null);
        setReceiptPreview('');
      } else {
        alert(data.error || 'Failed to submit donation');
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-xl border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Donate via Chapa
        </CardTitle>
        <CardDescription>Secure online donation with card or mobile money</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDonate} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (ETB) *</Label>
            <Input
              id="amount"
              type="number"
              min="10"
              placeholder="e.g., 100"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Dagmawi"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Lencho"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="dagmawi@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0909090909"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="receipt">Payment Receipt * 📸</Label>
            <Input
              id="receipt"
              type="file"
              accept="image/*"
              onChange={handleReceiptChange}
              required
            />
            {receiptPreview && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-primary/20 mt-2">
                <Image 
                  src={receiptPreview} 
                  alt="Receipt preview" 
                  fill 
                  className="object-contain bg-gray-50"
                />
              </div>
            )}
            <p className="text-xs text-gray-500">
              Upload screenshot of your transfer confirmation
            </p>
          </div>

          <Button
            type="submit"
            disabled={processing}
            className="w-full h-14 gradient-secondary text-white font-bold text-lg"
          >
            {processing ? (
              <span className="animate-pulse">Uploading...</span>
            ) : (
              `Submit Donation ${formData.amount || '___'} ETB`
            )}
          </Button>

          <p className="text-xs text-center text-gray-600">
            ✅ Admin will verify your payment within 24 hours
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

