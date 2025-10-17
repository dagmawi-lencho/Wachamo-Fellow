'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Cross, BookOpen, Users, Heart, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-spiritual opacity-20"></div>
      
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
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-glow"></div>
              <img 
                src="/logo.png" 
                alt="Wachamo Fellowship Logo" 
                className="relative w-16 h-16 rounded-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Wachamo Fellowship
              </h1>
              <p className="text-sm text-muted-foreground">Evangelical Students Union</p>
            </div>
          </div>
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
            <div className="w-40 h-40 mx-auto rounded-full gradient-spiritual p-1 mb-6">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-4">
                <img 
                  src="/logo.png" 
                  alt="Wachamo Fellowship Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-shift">
                Welcome to
              </span>
              <br />
              <span className="text-foreground">Wachamo University</span>
              <br />
              <span className="text-primary">Fellowship BSC Team</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
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
                className="gradient-primary text-white font-bold text-xl px-12 py-8 rounded-2xl border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-300 group"
              >
                <span className="flex items-center gap-3">
                  Get Started
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </Button>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              {[
                { icon: Users, title: 'Community', desc: 'Join fellow believers' },
                { icon: BookOpen, title: 'Bible Study', desc: 'Grow in faith together' },
                { icon: Heart, title: 'Service', desc: 'Serve with purpose' }
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-primary/20"
                >
                  <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
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
          className="text-center py-8 text-sm text-muted-foreground"
        >
          <p>&ldquo;For where two or three gather in my name, there am I with them.&rdquo; - Matthew 18:20</p>
        </motion.footer>
      </div>
    </div>
  );
}
