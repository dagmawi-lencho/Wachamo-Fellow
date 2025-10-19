// Simple cart management using localStorage

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: string;
}

export const cartStore = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('fellowship_cart');
    return cart ? JSON.parse(cart) : [];
  },

  setCart: (cart: CartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('fellowship_cart', JSON.stringify(cart));
  },

  addItem: (product: { _id: string; name: string; price: number; imageUrl?: string; category: string }) => {
    const cart = cartStore.getCart();
    const existing = cart.find(item => item.productId === product._id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        category: product.category
      });
    }
    
    cartStore.setCart(cart);
    return cart;
  },

  removeItem: (productId: string) => {
    const cart = cartStore.getCart().filter(item => item.productId !== productId);
    cartStore.setCart(cart);
    return cart;
  },

  updateQuantity: (productId: string, quantity: number) => {
    const cart = cartStore.getCart();
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      cartStore.setCart(cart);
    }
    return cart;
  },

  clearCart: () => {
    cartStore.setCart([]);
  },

  getTotal: (): number => {
    return cartStore.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getCount: (): number => {
    return cartStore.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }
};


