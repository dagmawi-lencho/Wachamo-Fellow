'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Package, Pencil, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import ProductDialog from '@/components/ProductDialog';

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

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onCreate = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  const onEdit = (product: Product) => {
    setEditing(product);
    setOpenDialog(true);
  };

  const onDelete = async (product: Product) => {
    if (!confirm(`Delete ${product.name}?`)) return;
    try {
      await fetch(`/api/products/${product._id}`, { method: 'DELETE' });
      await fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = products.filter(p =>
    [p.name, p.description, p.category].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Manage Products</h1>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')} className="border-2 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShoppingCart className="w-10 h-10 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Product Management
            </h2>
          </div>
          <p className="text-gray-600">Create and manage fellowship shop items</p>
        </motion.div>

        <Card className="mb-6 border border-white/40 bg-white/95 backdrop-blur-xl shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">All Products</CardTitle>
                <CardDescription>Manage your shop inventory • {filtered.length} products</CardDescription>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Input 
                  placeholder="Search products..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="w-full sm:w-64" 
                />
                <Button onClick={onCreate} className="gradient-primary text-white h-12 px-6 shadow-lg hover:shadow-xl">
                  <Plus className="w-5 h-5 mr-2" /> New Product
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Package className="w-20 h-20 mx-auto mb-4 text-primary" />
            </motion.div>
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="max-w-md mx-auto border border-primary/20 bg-white/95 backdrop-blur-xl shadow-xl">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <Package className="w-14 h-14 text-primary/60" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {search ? 'Try a different search term' : 'Create your first product to get started'}
                </p>
                {!search && (
                  <Button onClick={onCreate} className="gradient-primary text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, index) => (
              <motion.div 
                key={p._id} 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border border-white/40 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:shadow-lg transition-shadow">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover rounded-2xl group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <Package className="w-20 h-20 text-primary/40 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">{p.name}</CardTitle>
                      <Badge className="gradient-secondary text-white shrink-0 shadow-md">
                        {p.category}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm">{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Price</p>
                          <p className="text-2xl font-bold text-primary">{p.price} ETB</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 mb-1">Stock</p>
                          <p className={`text-lg font-bold ${p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                            {p.stock}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => onEdit(p)} 
                          className="border-2 hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all"
                        >
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => onDelete(p)} 
                          className="border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 hover:scale-105 transition-all"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ProductDialog 
        open={openDialog} 
        onOpenChange={setOpenDialog} 
        product={editing}
        onSaved={async () => { setOpenDialog(false); await fetchProducts(); }}
      />
    </div>
  );
}


