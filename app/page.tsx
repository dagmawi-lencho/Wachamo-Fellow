'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Cross, BookOpen, Users, Heart, ArrowRight, ShoppingCart, Package } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-spiritual opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Cross className="w-12 h-12 text-primary/20" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <BookOpen className="w-16 h-16 text-secondary/20" />
      </div>
      <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <Heart className="w-14 h-14 text-primary/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-end items-center mb-8"
        >
          <Button
            variant="outline"
            onClick={() => router.push('/admin/login')}
            className="border-2 hover:bg-primary/10"
          >
            Admin Login
          </Button>
        </motion.header>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 relative cross-rays"
          >
            {/* Logo/Icon */}
            <div className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-8 relative">
            <Image
                src="/logo.png" 
                alt="Wachamo Fellowship Logo" 
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8 max-w-5xl px-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Welcome to
              </span>
              <span className="block text-gray-900 mb-2">Wachamo University</span>
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Fellowship BSC Team
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Join our spiritual family and be part of something greater. 
              Register today and walk in faith together.
            </p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="pt-8"
            >
              <Button
                size="lg"
                onClick={() => router.push('/register')}
                className="gradient-primary text-white font-bold text-lg sm:text-xl md:text-2xl px-8 sm:px-12 md:px-16 py-6 sm:py-7 md:py-8 rounded-3xl border-4 border-white shadow-2xl hover:scale-105 transition-all duration-300 group w-full sm:w-auto max-w-md"
              >
                <span className="flex items-center justify-center gap-3">
                  Get Started
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </Button>
              {/* Shop, Donate & Track Buttons */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => router.push('/shop')}
                    className="w-full h-16 text-lg font-bold bg-white/90 backdrop-blur-xl border-2 border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Visit Shop
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => router.push('/donate')}
                    className="w-full h-16 text-lg font-bold gradient-secondary text-white border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform animate-pulse" />
                    Donate Now
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => router.push('/track-order')}
                    className="w-full h-16 text-lg font-bold bg-white/90 backdrop-blur-xl border-2 border-secondary/30 text-secondary hover:bg-secondary hover:text-white hover:border-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    <Package className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Track Order
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 px-4"
            >
              {[
                { icon: Users, title: 'Community', desc: 'Join fellow believers in Christ' },
                { icon: BookOpen, title: 'Bible Study', desc: 'Grow in faith and knowledge' },
                { icon: Heart, title: 'Service', desc: 'Serve with love and purpose' }
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/40 ring-1 ring-primary/10 hover:shadow-2xl hover:border-primary/30 transition-all"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center py-8 sm:py-12 px-4"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto border border-primary/20 shadow-lg">
            <p className="text-sm sm:text-base text-gray-700 italic font-medium leading-relaxed">
              &ldquo;For where two or three gather in my name, there am I with them.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-primary font-semibold mt-2">- Matthew 18:20</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
