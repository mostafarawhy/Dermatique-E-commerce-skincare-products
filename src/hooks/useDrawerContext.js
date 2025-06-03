import { useContext } from "react";

import { DrawerContext } from "../providers/DrawerProvider.jsx";

export function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a DrawerProvider");
  }
  return context;
}
