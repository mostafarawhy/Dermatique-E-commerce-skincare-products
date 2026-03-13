import { useCallback, useReducer, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import cartReducer, { initialCartState } from "../reducers/cartReducer";
import api from "../api/index";
import { message } from "antd";

export function useCart() {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
  const { state: authState, logout } = useAuthContext();

  useEffect(() => {
    if (authState.isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem("cart"));
      if (localCart && localCart.items.length > 0) {
        mergeGuestCartWithServer(localCart);
        localStorage.removeItem("cart");
      } else {
        fetchCart();
      }
    } else {
      const localCart =
        JSON.parse(localStorage.getItem("cart")) || initialCartState;
      dispatch({ type: "SET_CART", payload: localCart });
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cartState));
    }
  }, [cartState, authState.isAuthenticated]);

  const fetchCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await api.get("/cart", { withCredentials: true });
      dispatch({ type: "SET_CART", payload: response.data });
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const mergeGuestCartWithServer = async (guestCart) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await api.post(
        "/cart/merge",
        { guestCart },
        {
          withCredentials: true,
        },
      );
      dispatch({ type: "SET_CART", payload: response.data });
    } catch (error) {
      console.error("Error merging cart:", error);
      message.error("Failed to merge cart");
      fetchCart();
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = useCallback(
    async (product) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        if (authState.isAuthenticated) {
          const response = await api.post(
            "/cart/add",
            { productId: product._id, quantity: 1 },
            { withCredentials: true },
          );
          dispatch({ type: "SET_CART", payload: response.data });
        } else {
          dispatch({ type: "ADD_TO_CART", payload: product });
        }
        message.success("Item added to cart successfully");
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [authState.isAuthenticated],
  );

  const updateItemQuantity = useCallback(
    async (itemId, change) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        if (authState.isAuthenticated) {
          const response = await api.put(
            "/cart/update",
            { productId: itemId, change },
            { withCredentials: true },
          );
          dispatch({ type: "SET_CART", payload: response.data });
        } else {
          dispatch({
            type: "UPDATE_ITEM_QUANTITY",
            payload: { itemId, change },
          });
        }
        message.success("Cart updated successfully");
      } catch (error) {
        console.error("Error updating cart:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [authState.isAuthenticated],
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        if (authState.isAuthenticated) {
          const response = await api.delete(`/cart/remove/${itemId}`, {
            withCredentials: true,
          });
          dispatch({ type: "SET_CART", payload: response.data });
        } else {
          dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
        }
        message.success("Item removed from cart successfully");
      } catch (error) {
        console.error("Error removing from cart:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [authState.isAuthenticated],
  );

  const emptyCart = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      if (authState.isAuthenticated) {
        await api.delete("/cart/empty", {
          withCredentials: true,
        });
      }
      dispatch({
        type: "SET_CART",
        payload: {
          items: [],
          totalQuantity: 0,
          totalPrice: 0,
        },
      });
    } catch (error) {
      console.error("Error emptying cart:", error);
      message.error("Failed to empty cart");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [authState.isAuthenticated]);

  return {
    cartState,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    emptyCart,
  };
}
