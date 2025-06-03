import React, { useCallback, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Flex,
  Drawer,
  ConfigProvider,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthContext } from "../../../hooks/useAuthContext";

const { Title, Text } = Typography;
const { Item } = Form;



const MobileSignInDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();

  const {
    login,
    state,
    getCurrentUser,
    googleLogin: authGoogleLogin,
  } = useAuthContext();
  const [form] = Form.useForm();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google login success:", tokenResponse);


        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        console.log("Google user info:", userInfo.data);

        await authGoogleLogin(userInfo.data);
        await getCurrentUser();
        navigate("/");
      } catch (error) {
        console.error("Google login error:", error);
        message.error(error.response?.data?.message || "Google login failed");
      } finally {
        onClose();
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      message.error("Google login failed");
    },
  });

  const handleLogin = async (values) => {
    try {
      await login(values);
      await getCurrentUser();
      if (state.isAuthenticated) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      onClose();
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#B4ADA7",
          colorPrimaryHover: "#3B3535",
          borderRadius: 8,
        },
        components: {
          Button: {
            primaryColor: "black",
            primaryHoverColor: "white",
            primaryHoverBg: "#3B3535",
            controlHeight: 50,
          },
        },
      }}
    >
      <Drawer
        destroyOnClose={true}
        style={{ background: "#d1cdc7", padding: 0 }}
        className="search-drawer-wrapper"
        placement="top"
        closable={false}
        open={open}
        height="100%"
        zIndex={19}
      >
        <Flex
          justify="center"
          align="start"
          style={{ minHeight: "100vh", padding: "20px" }}
        >
          <Flex vertical style={{ width: "100%", maxWidth: "400px" }}>
            <Title
              level={2}
              style={{ textAlign: "center", marginBottom: "1rem" }}
            >
              My Account
            </Title>
            <Title
              level={3}
              style={{ textAlign: "center", marginBottom: "0.5rem" }}
            >
              Sign In
            </Title>
            <Text style={{ textAlign: "center", marginBottom: "2rem" }}>
              Please enter your e-mail and password to access your account.
            </Text>
            <Form
              name="signin"
              onFinish={(values) => handleLogin(values)}
              layout="vertical"
              style={{ width: "100%" }}
            >
              <Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Item>
              <Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                />
              </Item>
              <Item>
                <Button
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                    padding: "1.4rem",
                  }}
                  type="primary"
                  htmlType="submit"
                  block
                >
                  Let's go <LoginOutlined />
                </Button>
              </Item>
              <Divider>or</Divider>

              <Item>
                <Button
                  onClick={handleGoogleLogin}
                  block
                  icon={<GoogleOutlined />}
                  className="google-login-button"
                >
                  Continue with Google
                </Button>
              </Item>
            </Form>
            <Flex
              gap={40}
              vertical
              align="center"
              justify="space-between"
              style={{ marginTop: "1rem", width: "100%" }}
            >
              <Text>
                Don't have an account?
                <Link onClick={onClose} to="/signup">
                  Create one.
                </Link>
              </Text>
              <Link href="/forgot-password">Forgot password?</Link>
            </Flex>
          </Flex>
        </Flex>
      </Drawer>
    </ConfigProvider>
  );
};

export default MobileSignInDrawer;
