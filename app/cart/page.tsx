'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cartStore, CartItem } from '@/lib/cartStore';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(cartStore.getCart());
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    const updated = cartStore.updateQuantity(productId, quantity);
    setCart([...updated]);
  };

  const removeItem = (productId: string) => {
    const updated = cartStore.removeItem(productId);
    setCart([...updated]);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">{cart.length} items</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/shop')} className="border-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {cart.length === 0 ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card className="max-w-md mx-auto border border-primary/20 bg-white/95 backdrop-blur-xl">
              <CardContent className="pt-12 pb-12 text-center">
                <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some products to get started!</p>
                <Button onClick={() => router.push('/shop')} className="gradient-primary text-white">
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-white/40 bg-white/95 backdrop-blur-xl">
                    <CardContent className="pt-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center shrink-0 relative">
                          {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-xl" />
                          ) : (
                            <ShoppingCart className="w-12 h-12 text-primary/40" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                          <p className="text-xl font-bold text-primary">{item.price} ETB</p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="sticky top-24"
              >
                <Card className="border border-primary/20 bg-white/95 backdrop-blur-xl shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.name} × {item.quantity}</span>
                          <span className="font-semibold">{item.price * item.quantity} ETB</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">{total} ETB</span>
                    </div>

                    <Button
                      onClick={() => router.push('/checkout')}
                      className="w-full h-14 gradient-secondary text-white font-bold text-lg"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => router.push('/shop')}
                      className="w-full border-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

