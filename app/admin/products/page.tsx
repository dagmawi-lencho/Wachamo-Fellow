'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Package, Pencil, Trash2, ArrowLeft } from 'lucide-react';
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
        <Card className="mb-6">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>List, create, edit and delete products</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-56" />
              <Button onClick={onCreate} className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" /> New Product
              </Button>
            </div>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No products found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <motion.div key={p._id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <Card className="border border-white/40 bg-white/95 backdrop-blur-xl">
                  <CardHeader>
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4 relative">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover rounded-xl" />
                      ) : (
                        <Package className="w-20 h-20 text-primary/40" />
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{p.name}</CardTitle>
                      <Badge className="gradient-secondary text-white shrink-0">{p.category}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary">{p.price} ETB</span>
                      <span className="text-xs text-gray-600">Stock: {p.stock}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => onEdit(p)} className="w-full border-2 hover:bg-primary/10">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" onClick={() => onDelete(p)} className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
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


