import {
  Form,
  Input,
  Button,
  Typography,
  Flex,
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
import "./css/login-page.css";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/index";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useAuthContext } from "../hooks/useAuthContext";

const { Title, Text } = Typography;
const { Item } = Form;

const LoginPage = () => {
  const {
    login: authLogin,
    getCurrentUser,

    googleLogin: authGoogleLogin,
  } = useAuthContext();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await authLogin(values);
      await getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );

        await authGoogleLogin(userInfo.data);
        await getCurrentUser();
        navigate("/");
      } catch (error) {
        console.error("Google login error:", error);
        message.error(error.response?.data?.message || "Google login failed");
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      message.error("Google login failed");
    },
  });

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
      <Flex className="login-wrapper">
        <Flex vertical className="login-form-wrapper">
          <Title level={2} className="login-form-title">
            My Account
          </Title>
          <Title level={3} className="sign-in-title">
            Sign In
          </Title>
          <Text
            className="login-form-text"
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            Please enter your e-mail and password to access your account.
          </Text>
          <Form
            name="signin"
            onFinish={onFinish}
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
                className="button-sigh-in"
                type="primary"
                htmlType="submit"
                block
              >
                {`Let's go`}
                <LoginOutlined />
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
          <Flex gap={40} vertical className="login-form-links-wrapper">
            <Text>
              {` Don't have an account?`}
              <Link style={{ textDecoration: "underline" }} to="/signup">
                Create one.
              </Link>
            </Text>
            <Link
              style={{ textDecoration: "underline" }}
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default LoginPage;
