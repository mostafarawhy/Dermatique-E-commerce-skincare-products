import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const {
    state,
    signup,
    login,
    googleLogin,
    logout,
    clearError,
    checkAuthStatus,
    getCurrentUser,
    authChecked,
    deleteAccount,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        state,
        checkAuthStatus,
        signup,
        login,
        googleLogin,
        logout,
        clearError,
        getCurrentUser,
        authChecked,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
