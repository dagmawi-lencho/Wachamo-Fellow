'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export function DonateForm() {
  const [formData, setFormData] = useState({
    amount: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [processing, setProcessing] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
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
          productName: 'Fellowship Donation'
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Chapa checkout
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to process donation. Please try again.');
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
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
              placeholder="john@example.com"
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

          <Button
            type="submit"
            disabled={processing}
            className="w-full h-14 gradient-secondary text-white font-bold text-lg"
          >
            {processing ? 'Processing...' : `Donate ${formData.amount || '___'} ETB`}
          </Button>

          <p className="text-xs text-center text-gray-500">
            🔒 Secure payment powered by Chapa
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

