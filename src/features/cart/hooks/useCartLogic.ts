// Custom hook for cart logic
import { useCart } from '../CartContext';
import { 
  calculateTotalItems, 
  calculateTotalPrice, 
  calculateShippingCost, 
  calculateFinalTotal,
  isProductInCart,
  getItemByProductId,
  validateCartForCheckout
} from '../services/cart-logic.service';

export function useCartLogic() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCart();
  
  const totalItems = calculateTotalItems(items);
  const totalPrice = calculateTotalPrice(items);
  const shippingCost = calculateShippingCost(totalPrice);
  const finalTotal = calculateFinalTotal(items);
  
  const isProductInCartCheck = (productId: string) => 
    isProductInCart(items, productId);
  
  const getItemByProductIdCheck = (productId: string) => 
    getItemByProductId(items, productId);
  
  const validateForCheckoutCheck = () => 
    validateCartForCheckout(items);
  
  return {
    items,
    totalItems,
    totalPrice,
    shippingCost,
    finalTotal,
    isProductInCart: isProductInCartCheck,
    getItemByProductId: getItemByProductIdCheck,
    validateForCheckout: validateForCheckoutCheck,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
