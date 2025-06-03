import React, { useEffect } from "react";
import {
  Drawer,
  Button,
  Flex,
  Typography,
  Tooltip,
  ConfigProvider,
  message,
} from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";

import "../../css/bag-drawer.css";
import { useMediaQuery } from "@mui/material";
import { useCartContext } from "../../../hooks/useCartContext";
import BagItem from "./BagItem";
import { useNavigate } from "react-router-dom";
import { useDrawerContext } from "../../../hooks/useDrawerContext";
import { useAuthContext } from "../../../hooks/useAuthContext";

const { Text } = Typography;

const BagDrawer = ({
  open,
  onClose,
  onCloseDrawers,
  bagItems,
  onRemoveItem,
}) => {
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const navigate = useNavigate();
  const { toggleDrawer } = useDrawerContext();
  const { state } = useAuthContext();

  const { addToCart, cartState, updateItemQuantity, removeFromCart } =
    useCartContext();

  const handleCheckout = () => {
    if (state.isAuthenticated) {
      toggleDrawer("bag");
      navigate("/checkout");
    } else {
      toggleDrawer("bag");
      navigate("/login");
      message.error("You have to login first or create a new account ");
    }
  };

  const drawerTheme = {
    token: {
      colorPrimary: "#2C2827",
      colorPrimaryHover: "#3B3535",
      colorBgElevated: "#d1cdc7",
    },
    components: {
      Drawer: {
        contentBackground: "#d1cdc7",
        Button: {
          primaryColor: "black",
          primaryHoverColor: "white",
          primaryHoverBg: "#3B3535",
        },
      },
    },
  };

  return (
    <ConfigProvider theme={drawerTheme}>
      <Drawer
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        width={isDesktop ? "40%" : "80%"}
        className="full-screen-drawer"
        zIndex={19}
      >
        <Flex className="drawer-content-wrapper" vertical>
          <Button
            icon={
              <CloseOutlined style={{ fontSize: "24px", color: "black" }} />
            }
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              alignSelf: "flex-start",
              marginBottom: "16px",
            }}
          />
          <Flex className="bag-wrapper" vertical>
            {cartState.items.map((item, index) => (
              <BagItem
                key={index}
                quantity={item.quantity}
                id={item._id}
                price={item.price}
                product={item.name}
                image={item.image}
                remove={removeFromCart}
                update={updateItemQuantity}
              />
            ))}

            {cartState.items.length > 0 ? (
              <Text
                style={{
                  fontSize: "16px",
                  fontWeight: "bolder",
                  borderBottom: "1px solid black",
                }}
              >{`TotalPrice : ${cartState.totalPrice.toFixed(2)} €`}</Text>
            ) : (
              <Text
                style={{
                  fontSize: "18px",
                  fontWeight: "bolder",
                  borderBottom: "1px solid black",
                }}
              >{`Your bag is empty ! Try out our products . `}</Text>
            )}
          </Flex>
          <Button
            onClick={handleCheckout}
            className="checkout-button"
            type="primary"
          >
            Check out
          </Button>
        </Flex>
      </Drawer>
    </ConfigProvider>
  );
};

export default BagDrawer;
