export const TOGGLE_DRAWER = "TOGGLE_DRAWER";
export const SET_DRAWER = "SET_DRAWER";
export const CLOSE_ALL = "CLOSE_ALL";

export const MENU_ITEMS = {
  main: ["SHOP", "STANDARDS", "STORIES", "SALOON"],
  SHOP: ["CATEGORIES", "SALE", "NEW ARRIVALS"],
  STANDARDS: ["SUSTAINABILITY", "INGREDIENTS"],
};

export const initialState = {
  main: false,
  secondary: false,
  search: false,
  bag: false,
  account: false,
};

export const ShopTheme = {
  token: {
    colorPrimary: "#B4ADA7",
    colorPrimaryHover: "#3B3535",
  },
  components: {
    Button: {
      primaryColor: "black",
      primaryHoverColor: "white",
      primaryHoverBg: "#3B3535",
    },
    Pagination: {
      itemActiveBg: "#3B3535",
      itemBg: "transparent",
      itemLinkBg: "black",
      itemActiveColorDisabled: "black",
      itemActiveBgDisabled: "black",
    },
  },
};
export const SpinnerTheme = {
  components: {
    Spin: {
      colorPrimary: "rgba(0, 0, 0, 0.88)",
      colorBgContainer: "rgba(0, 0, 0, 0.06)",
    },
  },
};
