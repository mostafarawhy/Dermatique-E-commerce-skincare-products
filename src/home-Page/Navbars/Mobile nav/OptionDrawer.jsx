import { Drawer, Button, Flex, Typography, ConfigProvider } from "antd";
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const OptionDrawer = ({
  open,
  onClose,
  onCloseDrawers,
  listItems,
  buttonLabel,
  buttonIcon,
  onClickItem,
}) => {
  const navigate = useNavigate();

  const drawerTheme = {
    components: {
      Drawer: {
        contentBackground: "#d1cdc7",
      },
      Button: {
        colorPrimary: "transparent",
        colorPrimaryHover: "rgba(0, 0, 0, 0.1)",
      },
    },
    token: {
      colorBgElevated: "#d1cdc7",
      colorLink: "inherit",
      colorLinkHover: "rgba(0, 0, 0, 0.7)",
    },
  };

  return (
    <ConfigProvider theme={drawerTheme}>
      <Drawer
        style={{ position: "absolute", top: "80px" }}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        width="100%"
        className="full-screen-drawer"
        zIndex={19}
      >
        <Flex
          vertical
          style={{ height: "100%" }}
          className="option-drawer-content-wrapper"
        >
          <Button
            icon={
              <CloseOutlined style={{ fontSize: "24px", color: "black" }} />
            }
            onClick={onCloseDrawers}
            style={{
              alignSelf: "flex-start",
              marginBottom: "16px",
              background: "transparent",
              border: "none",
              boxShadow: "none",
            }}
          />
          <Flex vertical className="drawer-content">
            {buttonLabel && (
              <Link className="mobile-nav-drawer-option" onClick={onClose}>
                <Flex justify="space-between" align="center">
                  {buttonLabel}
                  {buttonIcon === "backArrow" && <LeftOutlined />}
                  {buttonIcon === "forwardArrow" && <RightOutlined />}
                </Flex>
              </Link>
            )}
            {listItems.map((item, index) => (
              <Link
                to={`/${item.toLowerCase()}`}
                key={index}
                className="mobile-nav-drawer-option"
                onClick={onClickItem}
              >
                {item}
              </Link>
            ))}
          </Flex>
        </Flex>
      </Drawer>
    </ConfigProvider>
  );
};

export default OptionDrawer;
