import { useReducer, useState } from "react";
import {
  TOGGLE_DRAWER,
  SET_DRAWER,
  CLOSE_ALL,
  MENU_ITEMS,
  initialState,
} from "../constants";
import drawersReducer from "../reducers/drawersReducer";

function useDrawers() {
  const [drawerState, dispatch] = useReducer(drawersReducer, initialState);
  const [activeMenu, setActiveMenu] = useState("main");

  const toggleDrawer = (drawer) => {
    dispatch({ type: TOGGLE_DRAWER, drawer });
  };

  const setDrawer = (drawer, value) => {
    dispatch({ type: SET_DRAWER, drawer, value });
  };

  const handleBackClick = () => {
    setActiveMenu("main");
    setDrawer("secondary", false);
  };

  const handleMenuItemClick = (item) => {
    if (MENU_ITEMS[item]) {
      setActiveMenu(item);
      setDrawer("secondary", true);
    } else {

      console.log(`Clicked on ${item}`);
    }
  };

  const closeAllDrawers = () => {
    dispatch({ type: CLOSE_ALL });
    setActiveMenu("main");
  };

  return {
    drawerState,
    activeMenu,
    toggleDrawer,
    setDrawer,
    closeAllDrawers,
    handleMenuItemClick,
    handleBackClick,
    MENU_ITEMS,
  };
}

export default useDrawers;
