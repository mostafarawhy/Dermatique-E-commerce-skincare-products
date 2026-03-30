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
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const { Title, Text } = Typography;
const { Item } = Form;

const LoginPage = () => {
  const [form] = Form.useForm();

  const {
    login: authLogin,
    getCurrentUser,
    googleLogin: authGoogleLogin,
  } = useAuthContext();

  const navigate = useNavigate();

  const fillDemo = () => {
    form.setFieldsValue({
      email: "test-charlotte@gmail.com",
      password: "user123",
    });
  };

  const onFinish = async (values) => {
    try {
      await authLogin(values);
      await getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
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
    onError: () => {
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

          <div
            style={{
              background: "#fff",
              border: "1px solid #e0d8d0",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: "1.5rem",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#B4ADA7",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#3B3535",
                }}
              >
                Demo account
              </span>
            </div>

            <Text
              style={{
                fontSize: 12.5,
                color: "#7a706a",
                display: "block",
                marginBottom: 10,
              }}
            >
              Try Dermatique with a sample account. Click USE to fill in the
              credentials automatically.
            </Text>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f9f5f1",
                border: "1px solid #ede7de",
                borderRadius: 7,
                padding: "6px 10px",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "#ede7de",
                  color: "#7a6e65",
                }}
              >
                Guest
              </span>

              <span style={{ flex: 1, fontSize: 12, color: "#5a5250" }}>
                test-charlotte@gmail.com
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: "#B4ADA7",
                  letterSpacing: "0.1em",
                }}
              >
                ••••••••
              </span>

              <Button
                size="small"
                onClick={fillDemo}
                style={{
                  fontSize: 11,
                  borderColor: "#d6cfc6",
                  color: "#7a706a",
                }}
              >
                Use
              </Button>
            </div>
          </div>

          <Form
            form={form}
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

            <Link style={{ textDecoration: "underline" }} to="/forgot-password">
              Forgot password?
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default LoginPage;
