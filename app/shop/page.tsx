'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Package, ArrowLeft, Tag } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Fellowship Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Fellowship Shop
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Support our ministry</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-2 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

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
                  We're currently preparing amazing products for you. Check back soon!
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
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/40 bg-white/95 backdrop-blur-xl">
                  <CardHeader>
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl"
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
                      <Button 
                        className="w-full gradient-primary text-white"
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Contact to Order'}
                      </Button>
                      <p className="text-xs text-center text-gray-500">
                        Payment integration coming soon
                      </p>
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
