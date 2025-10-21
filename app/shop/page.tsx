'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart, Package, ArrowLeft, Tag, Plus, CheckCircle2 } from 'lucide-react';
import { cartStore } from '@/lib/cartStore';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  isAvailable: boolean;
}

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<string>('');

  useEffect(() => {
    setCartCount(cartStore.getCount());
  }, []);

  const categories = ['all', 'Bible', 'Books', 'Stickers', 'T-Shirts', 'Accessories', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setAddingToCart(product._id);
    
    cartStore.addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category
    });
    
    setCartCount(cartStore.getCount());
    setLastAddedProduct(product.name);
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);
    
    // Reset button state
    setTimeout(() => setAddingToCart(null), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b-2 border-primary/20 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image 
                src="/logo.png" 
                alt="Fellowship Logo" 
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <div>
                <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Fellowship Shop
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-600">Support our ministry</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => router.push('/cart')}
                size="lg"
                style={{
                  background: 'linear-gradient(to right, #2ea7df, #f59f45)',
                }}
                className="relative text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all border-0"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="text-sm sm:text-base font-bold">Cart</span>
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 text-white rounded-full min-w-[26px] h-6 px-2 flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white"
                    style={{ backgroundColor: '#f59f45' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="border-2 hover:bg-primary/10 shadow-md"
                style={{ borderColor: '#2ea7df' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Home</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.3 }}
          className="fixed top-24 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-2xl border-2 border-white">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
                className="bg-white/20 p-2 rounded-full"
              >
                <ShoppingCart className="w-6 h-6" />
              </motion.div>
              <div>
                <p className="font-bold">Added to Cart!</p>
                <p className="text-sm opacity-90">{lastAddedProduct}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="w-10 h-10 text-primary" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Shop & Support
            </h2>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Every purchase supports our fellowship ministry and helps us serve the community better
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'gradient-primary text-white' : 'hover:bg-primary/10'}
              >
                <Tag className="w-4 h-4 mr-2" />
                {category === 'all' ? 'All Products' : category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
                <p className="text-gray-600 mb-4">
                  We&apos;re currently preparing amazing products for you. Check back soon!
                </p>
                <Button onClick={() => router.push('/')} className="gradient-primary text-white">
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
              >
                <Card className="h-full transition-all duration-300 border-2 border-primary/10 bg-white/95 backdrop-blur-xl overflow-hidden">
                  <CardHeader>
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4 relative">
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name}
                          fill
                          className="object-cover rounded-xl"
                        />
                      ) : (
                        <Package className="w-20 h-20 text-primary/40" />
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                      <Badge className="gradient-secondary text-white shrink-0">
                        {product.category}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {product.price} ETB
                        </span>
                        {product.stock > 0 && (
                          <span className="text-sm text-gray-600">
                            {product.stock} in stock
                          </span>
                        )}
                      </div>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="w-full"
                      >
                        <Button 
                          className={`w-full h-12 transition-all ${
                            addingToCart === product._id 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                              : 'gradient-primary'
                          } text-white`}
                          disabled={product.stock === 0 || addingToCart === product._id}
                          onClick={() => addToCart(product)}
                        >
                          {addingToCart === product._id ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                ✓
                              </motion.div>
                              Added to Cart!
                            </motion.div>
                          ) : product.stock === 0 ? (
                            'Out of Stock'
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-xl border border-primary/20">
            <CardContent className="pt-6">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold mb-2">Thank you for supporting!</h3>
                <p className="text-gray-700 mb-6">
                  Your generosity helps us spread the Gospel and serve our community better.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => router.push('/donate')} className="gradient-secondary text-white">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Now
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/')} className="border-2 hover:bg-primary/10">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
