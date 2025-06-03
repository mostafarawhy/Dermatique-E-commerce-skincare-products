import React, { useEffect, useState } from "react";
import { Flex, Typography, Button, Tooltip } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ShoppingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import ShopDropdown from "../ShopDropDown";
import "../css/navBar.css";
import SearchDrawer from "./Mobile nav/SearchDrawer";

import useDrawers from "../../hooks/useDrawers";
import BagDrawer from "./Mobile nav/BagDrawer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCartContext } from "../../hooks/useCartContext";
import { useDrawerContext } from "../../hooks/useDrawerContext";

const { Text } = Typography;

const NavBar = () => {
  const logged = false;
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
    <Flex className="navbar-container">
      <Flex justify="start" className="left-navbar">
        <Link to="/" className="logo-anchor">
          DERMA---TIQUE
        </Link>
      </Flex>

      <Flex justify="end" className="right-navbar">
        <ul className="navbar-items-wrapper">
          <li className="navbar-item">
            <Link className="navbar-item-link" to="/shop">
              SHOP
            </Link>
          </li>
          <li className="navbar-item">
            <Link className="navbar-item-link" href="/docs/resources">
              STANDARDS
            </Link>
          </li>
          <li className="navbar-item">
            <Link className="navbar-item-link" to="/stories">
              STORIES
            </Link>
          </li>
          <li className="navbar-item">
            <Link className="navbar-item-link" to="/saloon">
              SALON
            </Link>
          </li>
          <li className="navbar-item">
            <Flex className="navbar-item-controls">
              <Flex className="user-icon-wrapper">
                {isAuthenticated ? (
                  <Tooltip title={`Welcome ${user?.username}`}>
                    <Link to="/dashboard">
                      <Button type="text" icon={<UserOutlined />} />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link to="/login">
                    <Button type="text" icon={<UserOutlined />} />
                  </Link>
                )}
                {isAuthenticated && <span className="online-dot" />}
              </Flex>
              {/* <Button
                type="text"
                onClick={() => toggleDrawer("search")}
                icon={<SearchOutlined />}
              /> */}
              <Flex className="user-icon-wrapper">
                <Button
                  onClick={() => toggleDrawer("bag")}
                  type="text"
                  icon={<ShoppingOutlined />}
                />
                {cartState.items.length > 0 && (
                  <span className="bag-count">{cartState.totalQuantity}</span>
                )}
              </Flex>
            </Flex>
          </li>
        </ul>
        {/* 
        <SearchDrawer
          open={drawerState.search}
          onClose={() => toggleDrawer("search")}
        /> */}
        <BagDrawer open={drawerState.bag} onClose={() => toggleDrawer("bag")} />
      </Flex>
    </Flex>
  );
};

export default NavBar;
