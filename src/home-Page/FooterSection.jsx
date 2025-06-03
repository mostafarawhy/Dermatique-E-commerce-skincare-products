import { Button, Flex, Typography, ConfigProvider } from "antd";
import { Link, useNavigate } from "react-router-dom";

import "./css/footer-section.css";

const { Text } = Typography;

const FooterSection = () => {
  const navigate = useNavigate();
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#B4ADA7",
          colorText: "#d1cdc7",
          borderRadius: 8,
        },
        components: {
          Button: {
            colorPrimary: "#B4ADA7",
            colorPrimaryHover: "#C9C6C1",
            colorPrimaryActive: "#C9C6C1",
            primaryColor: "black",
            primaryHoverColor: "#3B2A1F",
            controlHeight: 50,
          },
        },
      }}
    >
      <Flex vertical className="footer-wrapper">
        <Flex vertical className="left-footer-wrapper">
          <Text className="left-footer-text">
            Let’s keep in touch. Sign up to receive 15% off your first order.
          </Text>
          <Link to="/signup">
            <Button
              className="custom-hover-button"
              style={{ marginTop: "30px" }}
              type="primary"
            >
              SIGN UP
            </Button>
          </Link>
        </Flex>
        <Flex className="right-footer-wrapper">
          <Flex className="right-footer-list-wrapper" vertical>
            <Link
              style={{ textDecoration: "underline" }}
              className="right-footer-list-header"
            >
              Info
            </Link>
            <ul className="right-footer-list">
              <li>
                <Link>About Us</Link>
              </li>

              <li>
                <Link>Salon</Link>
              </li>
              <li>
                <Link>Stockists</Link>
              </li>
              <li>
                <Link>Online </Link>
              </li>
              <li>
                <Link>Press</Link>
              </li>
              <li>
                <Link>Stories</Link>
              </li>
            </ul>
          </Flex>
          <Flex className="right-footer-list-wrapper" vertical>
            <Link
              style={{ textDecoration: "underline" }}
              className="right-footer-list-header"
            >
              Info
            </Link>
            <ul className="right-footer-list">
              <li>
                <Link>About Us</Link>
              </li>

              <li>
                <Link>Salon</Link>
              </li>
              <li>
                <Link>Stockists</Link>
              </li>
              <li>
                <Link>Online </Link>
              </li>
              <li>
                <Link>Press</Link>
              </li>
              <li>
                <Link>Stories</Link>
              </li>
            </ul>
          </Flex>
          <Flex className="right-footer-list-wrapper" vertical>
            <Link
              style={{ textDecoration: "underline" }}
              className="right-footer-list-header"
            >
              Info
            </Link>
            <ul className="right-footer-list">
              <li>
                <Link>About Us</Link>
              </li>

              <li>
                <Link>Salon</Link>
              </li>
              <li>
                <Link>Stockists</Link>
              </li>
              <li>
                <Link>Online </Link>
              </li>
              <li>
                <Link>Press</Link>
              </li>
              <li>
                <Link>Stories</Link>
              </li>
            </ul>
          </Flex>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default FooterSection;
