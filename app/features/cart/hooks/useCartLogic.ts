// Custom hook for cart logic
import { useCart } from './useCart';

export function useCartLogic() {
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
  } = useCart();
  
  return {
    items,
    totalItems,
    totalPrice,
    shippingCost,
    finalTotal,
    isProductInCart,
    getItemByProductId,
    validateForCheckout,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
