'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Heart, Building2, Copy, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Bank {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

export function DonateForm() {
  const [formData, setFormData] = useState({
    amount: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          firstName: formData.firstName,
          lastName: formData.lastName,
          bankName: selectedBank?.bankName,
          accountNumber: selectedBank?.accountNumber,
          phoneNumber: formData.phoneNumber,
          type: 'donation',
          productName: 'Fellowship Donation',
          receiptUrl: uploadData.url
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to success page with order number and type
        window.location.href = `/payment/success?tx_ref=${data.txRef}&order_number=${data.orderNumber}&status=pending&type=donation`;
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
          Make a Donation
        </CardTitle>
        <CardDescription>Transfer to our bank account and submit your receipt</CardDescription>
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

