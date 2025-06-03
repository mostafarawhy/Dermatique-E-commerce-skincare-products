import { useContext } from "react";
import { AuthContext } from "../providers/authProvider.jsx";

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a Authprovider");
  }
  return context;
}
