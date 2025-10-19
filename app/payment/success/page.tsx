'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    if (txRef) {
      fetch(`/api/payment/verify?tx_ref=${txRef}`)
        .then(res => res.json())
        .then(data => {
          setVerified(data.success);
        })
        .catch(console.error)
        .finally(() => setVerifying(false));
    } else {
      setVerifying(false);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border border-white/40 bg-white/95 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image src="/logo.png" alt="Logo" width={80} height={80} className="object-contain" />
            </div>
            
            {verifying ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <CardTitle>Verifying Payment...</CardTitle>
                <CardDescription>Please wait while we confirm your payment</CardDescription>
              </>
            ) : verified ? (
              <>
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <CardTitle className="text-green-600">Payment Successful!</CardTitle>
                <CardDescription>Thank you for your support. May God bless you!</CardDescription>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-3xl">❌</span>
                </div>
                <CardTitle className="text-red-600">Payment Failed</CardTitle>
                <CardDescription>Something went wrong. Please try again or contact support.</CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-3">
            <p className="text-sm text-center text-gray-600 italic">
              &ldquo;God loves a cheerful giver.&rdquo; - 2 Corinthians 9:7
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button onClick={() => router.push('/shop')} className="w-full gradient-primary text-white">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

