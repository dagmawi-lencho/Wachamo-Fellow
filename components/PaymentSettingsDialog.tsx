'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Building2, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { ethiopianBanks } from '@/lib/ethiopianBanks';

interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentSettingsDialog({ open, onOpenChange }: Props) {
  const [chapaPublicKey, setChapaPublicKey] = useState('');
  const [chapaSecretKey, setChapaSecretKey] = useState('');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [newBank, setNewBank] = useState({ bankName: '', accountName: '', accountNumber: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/payment-settings');
      const data = await res.json();
      if (data.settings) {
        setChapaPublicKey(data.settings.chapaPublicKey || '');
        setBankAccounts(data.settings.bankAccounts || []);
      }
    } catch {
      console.error('Failed to save settings');
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/payment-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapaPublicKey,
          chapaSecretKey: chapaSecretKey || undefined,
          bankAccounts
        })
      });

      if (res.ok) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save settings');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addBankAccount = () => {
    if (newBank.bankName && newBank.accountName && newBank.accountNumber) {
      setBankAccounts([...bankAccounts, newBank]);
      setNewBank({ bankName: '', accountName: '', accountNumber: '' });
    }
  };

  const removeBankAccount = (index: number) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Payment Settings
          </DialogTitle>
          <DialogDescription>
            Configure Chapa payment gateway and bank account details
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="chapa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chapa">Chapa API</TabsTrigger>
            <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
          </TabsList>

          {/* Chapa API Tab */}
          <TabsContent value="chapa" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Chapa Public Key</Label>
                <Input
                  placeholder="CHAPUBK-..."
                  value={chapaPublicKey}
                  onChange={(e) => setChapaPublicKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">Get from Chapa Dashboard → API Keys</p>
              </div>

              <div className="grid gap-2">
                <Label>Chapa Secret Key</Label>
                <Input
                  type="password"
                  placeholder="CHASECK-..."
                  value={chapaSecretKey}
                  onChange={(e) => setChapaSecretKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">Keep this secret! Never share publicly</p>
              </div>

              <div className="bg-blue-50/50 rounded-lg p-4 border border-primary/20">
                <p className="text-sm text-gray-700">
                  <strong className="text-primary">Note:</strong> Get your API keys from 
                  <a href="https://dashboard.chapa.co" target="_blank" rel="noopener" className="text-primary underline ml-1">
                    Chapa Dashboard
                  </a>. Make sure your account is verified and activated.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="banks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Bank Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <Label>Bank Name</Label>
                  <Select
                    value={newBank.bankName}
                    onValueChange={(val) => setNewBank({ ...newBank, bankName: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {ethiopianBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Account Name</Label>
                  <Input
                    placeholder="Wachamo Fellowship"
                    value={newBank.accountName}
                    onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Account Number</Label>
                  <Input
                    placeholder="1000123456789"
                    value={newBank.accountNumber}
                    onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                  />
                </div>

                <Button onClick={addBankAccount} className="w-full gradient-primary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bank Account
                </Button>
              </CardContent>
            </Card>

            {/* Current Bank Accounts */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Configured Bank Accounts
              </h3>
              {bankAccounts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No bank accounts added yet</p>
              ) : (
                bankAccounts.map((bank, index) => (
                  <Card key={index} className="border border-primary/20">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Badge className="gradient-primary text-white mb-2">{bank.bankName}</Badge>
                          <p className="font-semibold">{bank.accountName}</p>
                          <p className="text-sm text-gray-600 font-mono">{bank.accountNumber}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBankAccount(index)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-primary text-white">
            {saving ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

