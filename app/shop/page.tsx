'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Tag, Plus, Check, Sparkles, Filter, Home, Package, Heart, ArrowLeft } from 'lucide-react';
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
  const [bibleQuote, setBibleQuote] = useState({
    verse: "For where two or three gather in my name, there am I with them.",
    reference: "Matthew 18:20"
  });

  useEffect(() => {
    setCartCount(cartStore.getCount());
    fetchBibleQuote();
  }, []);

  const fetchBibleQuote = async () => {
    try {
      const res = await fetch('/api/bible-quotes/current');
      const data = await res.json();
      if (data.success && data.quote) {
        setBibleQuote(data.quote);
      }
    } catch (error) {
      console.error('Failed to fetch Bible quote:', error);
    }
  };

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
    
    setTimeout(() => setShowNotification(false), 3000);
    setTimeout(() => setAddingToCart(null), 1000);
  };

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
                  Wachamo Fellowship Shop
                </h1>
                <p className="text-xs text-gray-600">Christian Resources & More</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="hidden sm:flex"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={() => router.push('/cart')}
                className="relative bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white hover:shadow-lg transition-all"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Success Notification */}
      <AnimatePresence>
      {showNotification && (
        <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3"
          >
            <Check className="w-5 h-5" />
            <span className="font-semibold">Added &quot;{lastAddedProduct}&quot; to cart!</span>
        </motion.div>
      )}
      </AnimatePresence>

        {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#2ea7df] rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f59f45] rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-[#2ea7df]/30 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#f59f45]" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Fellowship Store</span>
          </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Equip Your <span className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent">Faith Journey</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our collection of Bibles, books, merchandise, and more to support your spiritual growth
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-12 flex-wrap"
        >
            <Filter className="w-5 h-5 text-gray-600" />
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={selectedCategory === cat 
                  ? 'bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white border-0 shadow-lg'
                  : 'border-2 hover:border-[#2ea7df] hover:bg-[#2ea7df]/5'
                }
              >
                {cat === 'all' ? 'All Products' : cat}
                {selectedCategory === cat && (
                  <Badge className="ml-2 bg-white/20">{filteredProducts.length}</Badge>
                )}
              </Button>
            ))}
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-3xl"></div>
                </div>
              ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No products found in this category</p>
          </motion.div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="group h-full bg-white border-2 border-gray-100 hover:border-[#2ea7df]/30 hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
                    {/* Product Image */}
                    <div className="relative h-64 bg-gradient-to-br from-blue-50 to-orange-50 overflow-hidden">
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-24 h-24 text-gray-300" />
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-gray-700 border-0 shadow-lg">
                          <Tag className="w-3 h-3 mr-1" />
                        {product.category}
                      </Badge>
                      </div>

                      {/* Stock Badge */}
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-red-500 text-white border-0 shadow-lg animate-pulse">
                            Only {product.stock} left!
                          </Badge>
                        </div>
                      )}
                      
                      {!product.isAvailable || product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <Badge className="bg-red-500 text-white text-lg px-6 py-2">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[#2ea7df] transition-colors">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-gray-600">
                        {product.description}
                      </CardDescription>
                  </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-3xl font-black bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent">
                            {product.price} <span className="text-lg">ETB</span>
                          </p>
                          <p className="text-xs text-gray-500">{product.stock} in stock</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.isAvailable || product.stock === 0 || addingToCart === product._id}
                        className="w-full bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white font-semibold py-6 rounded-2xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {addingToCart === product._id ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Added!
                          </>
                        ) : !product.isAvailable || product.stock === 0 ? (
                            'Out of Stock'
                          ) : (
                            <>
                            <Plus className="w-5 h-5 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2ea7df] to-[#f59f45] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 mx-auto text-white mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We&apos;re constantly adding new products. Or consider supporting us through a donation!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => router.push('/donate')}
                className="bg-white text-[#2ea7df] text-lg px-12 py-7 rounded-full shadow-2xl hover:bg-gray-50 hover:scale-105 transition-all font-bold"
              >
                <Heart className="w-5 h-5 mr-2" />
                Make a Donation
                  </Button>
              <Button
                size="lg"
                onClick={() => router.push('/')}
                className="bg-transparent border-2 border-white text-white text-lg px-12 py-7 rounded-full hover:bg-white hover:text-[#2ea7df] transition-all font-bold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                  </Button>
                </div>
        </motion.div>
      </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <h3 className="text-xl font-bold">Wachamo Fellowship</h3>
          </div>
          <p className="text-gray-400 text-sm mb-2">
            &copy; 2025/26 Wachamo Fellowship. Built with ❤️ by Dagmawi Lencho
          </p>
          <p className="text-gray-400 text-sm mb-4">
            info@wcufellowship.com • +251 916 362 062 • Hosaina, Ambicho
          </p>
          <p className="text-gray-500 italic text-sm">
            &quot;{bibleQuote.verse}&quot; - {bibleQuote.reference}
          </p>
        </div>
      </footer>
    </div>
  );
}
