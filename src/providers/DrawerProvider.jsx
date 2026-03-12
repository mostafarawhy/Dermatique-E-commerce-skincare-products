import { createContext } from "react";
import useDrawers from "../hooks/useDrawers";

export const DrawerContext = createContext();

export function DrawerProvider({ children }) {
  const {
    drawerState,
    activeMenu,
    toggleDrawer,
    setDrawer,
    closeAllDrawers,
    handleMenuItemClick,
    handleBackClick,
    MENU_ITEMS,
  } = useDrawers();
  return (
    <DrawerContext.Provider
      value={{
        drawerState,
        activeMenu,
        toggleDrawer,
        setDrawer,
        closeAllDrawers,
        handleMenuItemClick,
        handleBackClick,
        MENU_ITEMS,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}
