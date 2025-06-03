export const initialCartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isLoading: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "ADD_TO_CART": {
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      let updatedItems;

      if (existingItemIndex !== -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [
          ...state.items,
          {
            _id: action.payload._id,
            name: action.payload.name,
            image: action.payload.image,
            price: action.payload.price,
            quantity: 1,
          },
        ];
      }

      return updateCartTotals(updatedItems);
    }

    case "UPDATE_ITEM_QUANTITY": {
      const { itemId, change } = action.payload;
      let updatedItems = state.items.map((item) =>
        item._id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      );

      updatedItems = updatedItems.filter((item) => item.quantity > 0);

      return updateCartTotals(updatedItems);
    }

    case "REMOVE_FROM_CART": {
      const updatedItems = state.items.filter(
        (item) => item._id !== action.payload
      );
      return updateCartTotals(updatedItems);
    }

    case "SET_CART":
      return {
        ...action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
}

function updateCartTotals(items) {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return {
    items,
    totalQuantity,
    totalPrice,
    isLoading: false,
  };
}

export default cartReducer;
