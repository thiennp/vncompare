// Custom hook for cart logic
import { useCart } from '../CartContext';
import { calculateTotalItems } from '../services/calculateTotalItems';
import { calculateTotalPrice } from '../services/calculateTotalPrice';
import { calculateShippingCost } from '../services/calculateShippingCost';
import { calculateFinalTotal } from '../services/calculateFinalTotal';
import { isProductInCart } from '../services/isProductInCart';
import { getItemByProductId } from '../services/getItemByProductId';
import { validateCartForCheckout } from '../services/validateCartForCheckout';

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
