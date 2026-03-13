import { message } from "antd";
import authReducer from "../reducers/authReducer.js";
import { useCallback, useEffect, useReducer, useState } from "react";
import api from "../api";

const userInitialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  authInfo: localStorage.getItem("authInfo") || "null",
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
};

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, userInitialState);
  const [authChecked, setAuthChecked] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get("/users/current");
      dispatch({ type: "SET_CURRENT_USER", payload: response.data });
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      dispatch({
        type: "AUTH_FAIL",
        payload: "Failed to fetch current user",
      });
    }
  };

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("/users/current");

      dispatch({
        type: "SET_CURRENT_USER",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch current user",
      });
      throw error;
    }
  }, []);

  const signup = async (userData) => {
    try {
      const res = await axios.post("/api/auth/signup", userData);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "AUTH_FAIL",
        payload: err.response.data.message,
      });
    }
  };

  const login = async (values) => {
    try {
      const response = await api.post("/auth/login", values);
      const { user, token } = response.data;
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { authInfo: { token }, user },
      });
      message.success("Logged in successfully!");
      return user;
    } catch (error) {
      console.error("Login error:", error);
      dispatch({
        type: "LOGIN_FAIL",
        payload: error.response?.data?.message || "Login failed",
      });
      message.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const googleLogin = async (googleUserData) => {
    try {
      const response = await api.post("/auth/google-login", googleUserData, {
        withCredentials: true,
      });

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.user,
          authInfo: { token: response.data.token },
        },
      });

      message.success("Logged in with Google successfully!");
      return response.data.user;
    } catch (error) {
      console.error("Google login error:", error);
      dispatch({
        type: "LOGIN_FAIL",
        payload: error.response?.data?.message || "Google login failed",
      });
      message.error(error.response?.data?.message || "Google login failed");
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      dispatch({ type: "LOGOUT_SUCCESS" });
      message.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Logout failed. Please try again.");
    }
  }, []);

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const deleteAccount = async (password) => {
    try {
      const response = await api.delete("/users/delete-account", {
        data: { password },
        withCredentials: true,
      });

      if (response.status === 200) {
        message.success("Account deleted successfully");
        dispatch({ type: "LOGOUT_SUCCESS" });
        return true;
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      message.error(
        error.response?.data?.message || "Failed to delete account",
      );
      throw error;
    }
  };

  return {
    state,
    authChecked,
    checkAuthStatus,
    deleteAccount,
    signup,
    login,
    googleLogin,
    logout,
    clearError,
    getCurrentUser,
  };
}
