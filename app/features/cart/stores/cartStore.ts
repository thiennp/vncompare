import { create } from 'zustand';
import { Product } from '../../shared/services/models';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  finalTotal: number;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isProductInCart: (productId: string) => boolean;
  getItemByProductId: (productId: string) => CartItem | undefined;
  validateForCheckout: () => boolean;
}

type CartStore = CartState & CartActions;

// Helper functions
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + ((item.product.basePrice || 0) * item.quantity), 0);
};

const calculateShippingCost = (totalPrice: number): number => {
  if (totalPrice >= 1000000) return 0; // Free shipping over 1M VND
  if (totalPrice >= 500000) return 50000; // 50k VND for orders over 500k
  return 100000; // 100k VND standard shipping
};


export const useCartStore = create<CartStore>((set, get) => ({
  // State
  items: [],
  totalItems: 0,
  totalPrice: 0,
  shippingCost: 0,
  finalTotal: 0,

  // Actions
  addItem: (product, quantity = 1) => {
    const { items } = get();
    const existingItem = items.find(item => item.product._id === product._id);
    
    if (existingItem) {
      // Update existing item quantity
      const updatedItems = items.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      const newTotalItems = calculateTotalItems(updatedItems);
      const newTotalPrice = calculateTotalPrice(updatedItems);
      const newShippingCost = calculateShippingCost(newTotalPrice);
      const newFinalTotal = newTotalPrice + newShippingCost;
      
      set({
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
        shippingCost: newShippingCost,
        finalTotal: newFinalTotal,
      });
    } else {
      // Add new item
      const newItem: CartItem = { product, quantity };
      const updatedItems = [...items, newItem];
      const newTotalItems = calculateTotalItems(updatedItems);
      const newTotalPrice = calculateTotalPrice(updatedItems);
      const newShippingCost = calculateShippingCost(newTotalPrice);
      const newFinalTotal = newTotalPrice + newShippingCost;
      
      set({
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
        shippingCost: newShippingCost,
        finalTotal: newFinalTotal,
      });
    }
  },

  removeItem: (productId) => {
    const { items } = get();
    const updatedItems = items.filter(item => item.product._id !== productId);
    const newTotalItems = calculateTotalItems(updatedItems);
    const newTotalPrice = calculateTotalPrice(updatedItems);
    const newShippingCost = calculateShippingCost(newTotalPrice);
    const newFinalTotal = newTotalPrice + newShippingCost;
    
    set({
      items: updatedItems,
      totalItems: newTotalItems,
      totalPrice: newTotalPrice,
      shippingCost: newShippingCost,
      finalTotal: newFinalTotal,
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const { items } = get();
    const updatedItems = items.map(item =>
      item.product._id === productId
        ? { ...item, quantity }
        : item
    );
    const newTotalItems = calculateTotalItems(updatedItems);
    const newTotalPrice = calculateTotalPrice(updatedItems);
    const newShippingCost = calculateShippingCost(newTotalPrice);
    const newFinalTotal = newTotalPrice + newShippingCost;
    
    set({
      items: updatedItems,
      totalItems: newTotalItems,
      totalPrice: newTotalPrice,
      shippingCost: newShippingCost,
      finalTotal: newFinalTotal,
    });
  },

  clearCart: () => {
    set({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      shippingCost: 0,
      finalTotal: 0,
    });
  },

  isProductInCart: (productId) => {
    const { items } = get();
    return items.some(item => item.product._id === productId);
  },

  getItemByProductId: (productId) => {
    const { items } = get();
    return items.find(item => item.product._id === productId);
  },

  validateForCheckout: () => {
    const { items } = get();
    return items.length > 0 && items.every(item => item.quantity > 0);
  },
}));
