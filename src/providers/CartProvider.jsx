import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const {
    emptyCart,
    addToCart,
    cartState,
    updateItemQuantity,
    removeFromCart,
  } = useCart();
  return (
    <CartContext.Provider
      value={{
        emptyCart,
        cartState,
        addToCart,
        updateItemQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
