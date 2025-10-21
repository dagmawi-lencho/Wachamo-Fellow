'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Bank {
  _id?: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

interface Props {
  bank?: Bank;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function BankManagementDialog({ bank, open, onOpenChange, onSave }: Props) {
  const [formData, setFormData] = useState<Bank>(
    bank || {
      bankName: '',
      accountNumber: '',
      accountHolderName: 'Wachamo Fellowship'
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = bank?._id ? `/api/banks/${bank._id}` : '/api/banks';
      const method = bank?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        onOpenChange(false);
        setFormData({
          bankName: '',
          accountNumber: '',
          accountHolderName: 'Wachamo Fellowship'
        });
      } else {
        alert('Failed to save bank');
      }
    } catch (error) {
      console.error('Error saving bank:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {bank?._id ? 'Edit Bank Account' : 'Add New Bank Account'}
          </DialogTitle>
          <DialogDescription>
            Add or update fellowship bank account information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              placeholder="e.g., Commercial Bank of Ethiopia"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              placeholder="e.g., 1000123456789"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder Name *</Label>
            <Input
              id="accountHolderName"
              placeholder="e.g., Wachamo Fellowship"
              value={formData.accountHolderName}
              onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gradient-primary text-white">
              {saving ? 'Saving...' : 'Save Bank'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

