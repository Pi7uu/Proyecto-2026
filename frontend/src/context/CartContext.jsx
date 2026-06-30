import { createContext, useContext, useState, useCallback } from "react";
import { getCart, addToCart, removeFromCart, clearCart as apiClearCart } from "../api/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: "0" });

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await getCart();
      setCart(data);
    } catch {
      setCart({ items: [], total_items: 0, total_price: "0" });
    }
  }, []);

  const add = async (productId, data) => {
    await addToCart(productId, data);
    await fetchCart();
  };

  const remove = async (productId, size) => {
    await removeFromCart(productId, size);
    await fetchCart();
  };

  const clear = async () => {
    await apiClearCart();
    setCart({ items: [], total_items: 0, total_price: "0" });
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
