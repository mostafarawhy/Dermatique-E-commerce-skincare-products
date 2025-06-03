const initialCartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

export default function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "AUTH_SUCCESS": {
      const { authInfo, user } = action.payload;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authInfo", JSON.stringify(authInfo));
      localStorage.setItem("user", JSON.stringify(user));
      return {
        ...state,
        isAuthenticated: true,
        authInfo,
        user,
        loading: false,
        error: null,
      };
    }
    case "SET_CURRENT_USER": {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload, loading: false, error: null };
    }

    case "AUTH_FAIL":
    case "LOGIN_FAIL": {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authInfo");
      localStorage.removeItem("user");
      return {
        ...state,
        isAuthenticated: false,
        authInfo: null,
        user: null,
        loading: false,
        error: action.payload,
      };
    }
    case "LOGOUT_SUCCESS": {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authInfo");
      localStorage.removeItem("user");
      localStorage.setItem("cart", JSON.stringify(initialCartState));
      return {
        ...state,
        isAuthenticated: false,
        authInfo: null,
        user: null,
        loading: false,
        error: null,
      };
    }
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}
