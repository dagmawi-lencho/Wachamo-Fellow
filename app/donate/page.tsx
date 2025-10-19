'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, ArrowLeft, Send, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DonateForm } from './DonateForm';

export default function DonatePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Support the Ministry
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.push('/')} className="border-2 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="w-10 h-10 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Donate</h2>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto">Your donation helps us disciple students, share the Gospel, and serve our community in love.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <DonateForm />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/90 backdrop-blur-xl border border-primary/20">
              <CardHeader>
                <CardTitle>Bank Transfer</CardTitle>
                <CardDescription>Use the details below to make a transfer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-semibold">Commercial Bank of Ethiopia</span>
                  <span className="text-gray-600">Account Name</span>
                  <span className="font-semibold">Wachamo Fellowship</span>
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-semibold">1234 5678 9012</span>
                </div>
                <Separator className="my-2" />
                <p className="text-xs text-gray-600">After transferring, please send your receipt to our Telegram for confirmation.</p>
                <Button onClick={() => window.open('https://t.me/WcuEvaSU', '_blank')} className="w-full gradient-secondary text-white">
                  <Send className="w-4 h-4 mr-2" /> Contact on Telegram
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/90 backdrop-blur-xl border border-primary/20">
              <CardHeader>
                <CardTitle>Give In Person</CardTitle>
                <CardDescription>Support during fellowship gatherings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">You can give in person during our weekly Bible Study or Sunday gatherings. Ask any coordinator for assistance.</p>
                <Separator className="my-2" />
                <Button onClick={() => router.push('/shop')} variant="outline" className="w-full border-2 hover:bg-primary/10">
                  <ExternalLink className="w-4 h-4 mr-2" /> Visit Shop Instead
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-xl border border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Thank you for your generosity!</h3>
              <p className="text-gray-700">May the Lord bless you and keep you. 2 Corinthians 9:7</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


