'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Cross, Lock, Mail, Shield, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-spiritual opacity-20"></div>
      
      {/* Floating Cross */}
      <div className="absolute top-20 left-10 animate-float">
        <Cross className="w-16 h-16 text-primary/10" />
      </div>
      <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <Shield className="w-20 h-20 text-secondary/10" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-2 border-primary/20">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="mx-auto w-20 h-20 rounded-full bg-white p-2 border-2 border-primary"
            >
              <img 
                src="/logo.png" 
                alt="Wachamo Fellowship Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Admin Portal
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Wachamo Fellowship Management System
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@wachamo.edu.et"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2 focus:border-primary h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-2 focus:border-primary h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-bold gradient-primary text-white hover:scale-105 transition-transform"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="text-muted-foreground hover:text-primary"
                >
                  ← Back to Home
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Secure Admin Access Only<br />
                Default credentials: admin@wachamo.edu.et / admin123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bible Verse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-sm text-muted-foreground italic"
        >
          &ldquo;Serve one another in love&rdquo; - Galatians 5:13
        </motion.div>
      </motion.div>
    </div>
  );
}

