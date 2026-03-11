import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Result, Button, Spin, App } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import api from "../api/index";

const EmailVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();
  const { message: antMessage } = App.useApp();

  useEffect(() => {
    const abortController = new AbortController();

    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`, {
          signal: abortController.signal,
        });

        const data = response.data;

        setEmailData(data);
        setVerificationStatus("success");
        antMessage.success(data.message);
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Verification error:", error);

        if (error.response?.data?.message?.includes("already verified")) {
          setVerificationStatus("success");
          setEmailData({
            alreadyVerified: true,
            email: error.response?.data?.email,
          });
          antMessage.success("Email already verified");
        } else {
          setVerificationStatus("failed");
          setEmailData(error.response?.data);
          antMessage.error(
            error.response?.data?.message || "Verification failed"
          );
        }
      }
    };

    if (token) {
      verifyEmail();
    }

    return () => {
      abortController.abort();
    };
  }, [token, antMessage]);

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const emailToResend =
        emailData?.email || localStorage.getItem("pendingVerificationEmail");

      if (!emailToResend) {
        antMessage.error("Email not found. Please try signing up again.");
        return;
      }

      const response = await api.post("/auth/resend-verification", {
        email: emailToResend,
      });

      if (response.data.success) {
        if (response.data.alreadyVerified) {
          setVerificationStatus("success");
          setEmailData({ ...emailData, alreadyVerified: true });
          antMessage.success(
            "Your email is already verified. You can proceed to login."
          );
          setTimeout(() => navigate("/login"), 2000);
        } else {
          antMessage.success(
            "Verification email sent successfully. Please check your inbox."
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend verification email";
      antMessage.error(errorMessage);

      if (errorMessage.includes("already verified")) {
        setVerificationStatus("success");
        setEmailData({ ...emailData, alreadyVerified: true });
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (verificationStatus === "success") {
    localStorage.removeItem("pendingVerificationEmail");

    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title="Email Verification Successful!"
          subTitle={
            emailData?.alreadyVerified
              ? "Your email was already verified. You can proceed to login."
              : "Your email has been verified successfully. You can now login to your account."
          }
          extra={[
            <Button
              type="primary"
              key="login"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
          title="Verification Failed"
          subTitle={
            emailData?.reason === "expired"
              ? "Your verification link has expired. Please request a new one."
              : "There was a problem verifying your email. Please try again or request a new verification link."
          }
          extra={[
            <Button
              type="primary"
              key="resend"
              loading={loading}
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </Button>,
            <Button key="signup" onClick={() => navigate("/signup")}>
              Sign Up Again
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Result
        icon={
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        }
        title="Verifying Your Email"
        subTitle="Please wait while we verify your email address..."
      />
    </div>
  );
};

export default EmailVerificationPage;
