import { useCartStore } from '../stores/cartStore';

export function useCart() {
  const {
    items,
    totalItems,
    totalPrice,
    shippingCost,
    finalTotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isProductInCart,
    getItemByProductId,
    validateForCheckout,
  } = useCartStore();

  return {
    items,
    totalItems,
    totalPrice,
    shippingCost,
    finalTotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isProductInCart,
    getItemByProductId,
    validateForCheckout,
  };
}
