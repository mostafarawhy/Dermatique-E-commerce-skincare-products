import { useContext } from "react";
import { CartContext } from "../providers/cartProvider.jsx";

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a Cartprovider");
  }
  return context;
}
