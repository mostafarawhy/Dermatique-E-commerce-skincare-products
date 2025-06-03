import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Flex,
  ConfigProvider,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import "./css/signup.css";
import api from "../api/index";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Item } = Form;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await api.post("/auth/signup", {
        username: values.fullName,
        email: values.email,
        password: values.password,
      });


      localStorage.setItem("pendingVerificationEmail", values.email);

      message.success("Please check your email to verify your account");
      setVerificationSent(true);
    } catch (error) {
      message.error(error.response?.data?.message || "Error creating account");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (verificationSent) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#B4ADA7",
            colorPrimaryHover: "#3B3535",
            borderRadius: 8,
          },
        }}
      >
        <Flex className="signup-wrapper">
          <Flex vertical className="signup-form-wrapper">
            <Title level={2} className="signup-form-title">
              Verify Your Email
            </Title>
            <Text
              className="signup-form-text"
              style={{ textAlign: "center", marginBottom: "2rem" }}
            >
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your account.
            </Text>
            <Text type="secondary" style={{ textAlign: "center" }}>
              Didn't receive the email? Check your spam folder or
              <Button
                type="link"
                onClick={() => setVerificationSent(false)}
                style={{ padding: "0 4px" }}
              >
                try signing up again
              </Button>
            </Text>
            <Button
              type="primary"
              onClick={() => navigate("/login")}
              style={{ marginTop: "2rem" }}
            >
              Go to Login
            </Button>
          </Flex>
        </Flex>
      </ConfigProvider>
    );
  }

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
      <Flex className="signup-wrapper">
        <Flex vertical className="signup-form-wrapper">
          <Title level={2} className="signup-form-title">
            Create Account
          </Title>
          <Title level={3} className="signup-title">
            Sign Up
          </Title>
          <Text
            className="signup-form-text"
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            Please fill in the information below to create your account.
          </Text>
          <Form
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            style={{ width: "100%" }}
          >
            <Item
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Please input your full name!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
                size="large"
              />
            </Item>
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
                prefix={<MailOutlined />}
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
            <Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
              />
            </Item>
            <Item>
              <Button
                className="button-signup"
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create Account
                <LoginOutlined />
              </Button>
            </Item>
          </Form>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default SignUpPage;
