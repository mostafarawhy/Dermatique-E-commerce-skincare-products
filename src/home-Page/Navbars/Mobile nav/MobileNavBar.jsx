import { Flex, Typography, Button, Tooltip } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  ShoppingOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import "../../css/mobileNav.css";
import OptionDrawer from "./OptionDrawer";
import SearchDrawer from "./SearchDrawer";
import BagDrawer from "./BagDrawer";
import MobileSignInDrawer from "./MobileSignInDrawer";
import useDrawers from "../../../hooks/useDrawers";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCartContext } from "../../../hooks/useCartContext";
import { useDrawerContext } from "../../../hooks/useDrawerContext";

const MobileNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    drawerState,
    activeMenu,
    toggleDrawer,
    closeAllDrawers,
    handleMenuItemClick,
    handleBackClick,
    MENU_ITEMS,
  } = useDrawerContext();

  const { authChecked, logout, state } = useAuthContext();

  const { isAuthenticated, user, loading } = state;
  const { cartState } = useCartContext();

  return (
    <>
      <Flex
        vertical
        justify="space-between"
        align="center"
        className="mobile-nav-wrapper"
      >
        <Button
          icon={<MenuOutlined style={{ fontSize: "24px", color: "black" }} />}
          onClick={() => {
            toggleDrawer("main");

            drawerState.secondary && toggleDrawer("secondary");
          }}
          style={{
            background: "transparent",
            border: "none",
            padding: "10px",
            boxShadow: "none",
          }}
        />
        <Link to="/" style={{ fontSize: "20px", fontWeight: "bolder" }}>
          DERMA---TIQUE
        </Link>
        <Flex gap="small">
          <Flex className="mobile-user-wrapper">
            <Button
              type="text"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("dashboard");
                  closeAllDrawers();
                } else {
                  toggleDrawer("account");
                }
              }}
              icon={<UserOutlined />}
            />
            {isAuthenticated && <span className="mobile-online-dot" />}
          </Flex>
          {/* 
          <Button
            type="text"
            onClick={() => {
              toggleDrawer("search", !drawerState.search);
            }}
            icon={<SearchOutlined />}
          /> */}
          <Flex className="mobile-bag-wrapper">
            <Button
              onClick={() => {
                toggleDrawer("bag", !drawerState.bag);
              }}
              type="text"
              icon={<ShoppingOutlined />}
            />
            {cartState.items.length > 0 && (
              <span className="mobile-bag-count">
                {cartState.totalQuantity}
              </span>
            )}
          </Flex>
        </Flex>

        <OptionDrawer
          open={drawerState.main}
          onClose={() => toggleDrawer("main")}
          onCloseDrawers={closeAllDrawers}
          listItems={MENU_ITEMS.main}
          onClickItem={closeAllDrawers}
        />

        {/* <OptionDrawer
          open={drawerState.secondary}
          onClose={() => toggleDrawer("secondary")}
          onCloseDrawers={closeAllDrawers}
          buttonLabel="BACK"
          buttonIcon="backArrow"
          onButtonClick={handleBackClick}
          listItems={MENU_ITEMS[activeMenu] || []}
          onClickItem={handleMenuItemClick}
        /> */}
        {/* <SearchDrawer
          open={drawerState.search}
          onClose={() => toggleDrawer("search")}
        /> */}
        <BagDrawer open={drawerState.bag} onClose={() => toggleDrawer("bag")} />
        <MobileSignInDrawer
          open={drawerState.account}
          onClose={() => toggleDrawer("account")}
        />
      </Flex>
    </>
  );
};

export default MobileNavBar;
