'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, ArrowLeft, Send, Home, Sparkles, Gift, Star, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DonateForm } from './DonateForm';
import { useState, useEffect } from 'react';

interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export default function DonatePage() {
  const router = useRouter();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const res = await fetch('/api/payment-settings');
      const data = await res.json();
      setBankAccounts(data.settings?.bankAccounts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const impactAreas = [
    {
      icon: Users,
      title: 'Disciple Students',
      description: 'Help us run Bible studies and mentorship programs'
    },
    {
      icon: Heart,
      title: 'Community Outreach',
      description: 'Support our service projects and evangelism efforts'
    },
    {
      icon: Gift,
      title: 'Events & Gatherings',
      description: 'Fund worship nights, retreats, and fellowship events'
    },
    {
      icon: Star,
      title: 'Resources & Materials',
      description: 'Provide Bibles, books, and teaching materials'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent">
                  Support the Ministry
                </h1>
                <p className="text-xs text-gray-600">Every gift makes a difference</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/')} className="border-2 hover:bg-primary/10">
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#2ea7df] rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f59f45] rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-[#2ea7df]/30 shadow-sm mb-6">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Give Generously</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Partner With <span className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your generous donation helps us disciple students, share the Gospel, and serve our community in love.
            </p>
          </motion.div>

          {/* Impact Areas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {impactAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2ea7df] to-[#f59f45] rounded-2xl mb-4 shadow-lg">
                  <area.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{area.title}</h3>
                <p className="text-sm text-gray-600">{area.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Donation Forms Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <DonateForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white border-2 border-gray-100 shadow-xl rounded-3xl h-full">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#2ea7df]" />
                    Bank Transfer
                  </CardTitle>
                  <CardDescription>Transfer directly to our bank accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {bankAccounts.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Bank details will be available soon
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {bankAccounts.map((bank, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl border border-[#2ea7df]/20">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 font-medium">Bank</span>
                              <span className="font-bold text-gray-900">{bank.bankName}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 font-medium">Account Name</span>
                              <span className="font-semibold text-gray-900">{bank.accountName}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 font-medium">Account Number</span>
                              <span className="font-bold font-mono text-lg text-[#2ea7df]">{bank.accountNumber}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Separator className="my-4" />
                  <p className="text-xs text-gray-600 text-center">
                    After transferring, please send your receipt via our donation form or Telegram
                  </p>
                  <Button 
                    onClick={() => window.open('https://t.me/WcuEvaSU', '_blank')} 
                    className="w-full bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white rounded-2xl py-6 hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Contact on Telegram
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white border-2 border-gray-100 shadow-xl rounded-3xl h-full">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-[#f59f45]" />
                    Give In Person
                  </CardTitle>
                  <CardDescription>Support during fellowship gatherings</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80"
                      alt="Giving"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-bold">Every Gift Matters</p>
                      <p className="text-sm text-white/80">God loves a cheerful giver</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    You can give in person during our weekly Bible Study or Sunday gatherings. 
                    Ask any coordinator for assistance.
                  </p>
                  <Separator className="my-4" />
                  <Button 
                    onClick={() => router.push('/shop')} 
                    variant="outline" 
                    className="w-full border-2 border-[#2ea7df] text-[#2ea7df] hover:bg-[#2ea7df] hover:text-white rounded-2xl py-6 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Visit Shop Instead
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border-2 border-[#2ea7df]/20 shadow-xl rounded-3xl">
              <CardContent className="py-12">
                <Heart className="w-16 h-16 mx-auto text-red-500 mb-6" />
                <h3 className="text-3xl font-black text-gray-900 mb-4">Thank You for Your Generosity!</h3>
                <p className="text-xl text-gray-700 mb-2">May the Lord bless you and keep you.</p>
                <p className="text-gray-600 italic">&quot;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&quot;</p>
                <p className="text-sm text-gray-500 mt-2">- 2 Corinthians 9:7</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
