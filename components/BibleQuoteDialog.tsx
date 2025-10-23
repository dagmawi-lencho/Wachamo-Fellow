'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, BookOpen } from 'lucide-react';

interface BibleQuote {
  _id: string;
  verse: string;
  reference: string;
  isActive: boolean;
  createdAt: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BibleQuoteDialog({ open, onOpenChange }: Props) {
  const [quotes, setQuotes] = useState<BibleQuote[]>([]);
  const [editingQuote, setEditingQuote] = useState<BibleQuote | null>(null);
  const [formData, setFormData] = useState({
    verse: '',
    reference: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchQuotes();
    }
  }, [open]);

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/bible-quotes');
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingQuote) {
        // Update existing quote
        await fetch(`/api/bible-quotes/${editingQuote._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Create new quote
        await fetch('/api/bible-quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      setFormData({ verse: '', reference: '' });
      setEditingQuote(null);
      fetchQuotes();
    } catch (error) {
      console.error('Failed to save quote:', error);
      alert('Failed to save quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (quote: BibleQuote) => {
    setEditingQuote(quote);
    setFormData({
      verse: quote.verse,
      reference: quote.reference
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      await fetch(`/api/bible-quotes/${id}`, {
        method: 'DELETE'
      });
      fetchQuotes();
    } catch (error) {
      console.error('Failed to delete quote:', error);
      alert('Failed to delete quote');
    }
  };

  const handleToggleActive = async (quote: BibleQuote) => {
    try {
      await fetch(`/api/bible-quotes/${quote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !quote.isActive })
      });
      fetchQuotes();
    } catch (error) {
      console.error('Failed to toggle quote:', error);
    }
  };

  const cancelEdit = () => {
    setEditingQuote(null);
    setFormData({ verse: '', reference: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="w-6 h-6 text-primary" />
            Bible Quotes Management
          </DialogTitle>
          <DialogDescription>
            Add and manage Bible verses that rotate every 2 hours on the website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add/Edit Form */}
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-2xl border-2 border-primary/20">
            <h3 className="text-lg font-bold mb-4">
              {editingQuote ? 'Edit Quote' : 'Add New Quote'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="verse">Bible Verse *</Label>
                <Textarea
                  id="verse"
                  placeholder="e.g., For where two or three gather in my name, there am I with them."
                  value={formData.verse}
                  onChange={(e) => setFormData({ ...formData, verse: e.target.value })}
                  required
                  className="min-h-24"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="reference">Reference *</Label>
                <Input
                  id="reference"
                  placeholder="e.g., Matthew 18:20"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary to-secondary text-white"
                >
                  {isSubmitting ? 'Saving...' : editingQuote ? 'Update Quote' : 'Add Quote'}
                </Button>
                {editingQuote && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Quotes List */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              All Bible Quotes ({quotes.length})
            </h3>
            {quotes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No quotes added yet. Add your first Bible quote above!</p>
              </div>
            ) : (
              <div className="border rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="w-12">No.</TableHead>
                      <TableHead>Verse</TableHead>
                      <TableHead className="w-48">Reference</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote, index) => (
                      <TableRow key={quote._id}>
                        <TableCell className="font-semibold text-gray-600">{index + 1}</TableCell>
                        <TableCell className="max-w-md">
                          <p className="italic text-gray-700 line-clamp-2">&quot;{quote.verse}&quot;</p>
                        </TableCell>
                        <TableCell className="font-semibold text-primary">{quote.reference}</TableCell>
                        <TableCell>
                          <Badge
                            onClick={() => handleToggleActive(quote)}
                            className={`cursor-pointer ${quote.isActive ? 'bg-green-600' : 'bg-gray-400'}`}
                          >
                            {quote.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(quote)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(quote._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">ℹ️ How Quote Rotation Works:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Quotes rotate automatically every 2 hours across the website</li>
              <li>• Only active quotes are displayed in rotation</li>
              <li>• If no quotes exist, the default Matthew 18:20 is shown</li>
              <li>• Click the status badge to toggle active/inactive</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

