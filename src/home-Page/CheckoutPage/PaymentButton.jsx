import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { message, Alert, Spin, ConfigProvider, Flex } from "antd";
import api from "../../api/index.js";
import { LoadingOutlined } from "@ant-design/icons";
import { SpinnerTheme } from "../../constants.js";

const PaymentButton = ({ amount, onSuccess }) => {
  const [error, setError] = useState(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const clientId = import.meta.env.VITE_DERMATIQUE_APP_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (clientId) setPaypalLoaded(true);
  }, [clientId]);

  const createOrder = async () => {
    try {
      setPaymentStatus("processing");
      setError(null);
      console.log("Creating order for amount:", amount);

      const response = await api.post("/paypal/create-order", { amount });

      if (!response.data || !response.data.id) {
        throw new Error("Invalid response from server");
      }

      return response.data.id;
    } catch (error) {
      console.error("Create order error:", error);
      setPaymentStatus("failed");
      const errorMessage =
        error.response?.data?.message || "Failed to create order";
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  };

  const onApprove = async (data) => {
    console.log("Payment approved, processing...", data);
    setPaymentStatus("processing");
    setError(null);

    try {
      const response = await api.post("/paypal/capture-payment", {
        orderID: data.orderID,
      });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Payment failed");
      }

      setPaymentStatus("success");


      if (onSuccess && typeof onSuccess === "function") {
        await onSuccess(response.data);
      }

      return true;
    } catch (error) {
      console.error("Payment capture error:", error);
      setPaymentStatus("failed");
      const errorMessage = error.response?.data?.message || "Payment failed";
      setError(errorMessage);
      message.error(errorMessage);


      return false;
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    setPaymentStatus("failed");
    setError(err.message || "Payment processing error");
    message.error("Payment processing error");
  };

  const onCancel = () => {
    setPaymentStatus("idle");
    setError(null);
    message.info("Payment cancelled");
  };

  if (!paypalLoaded) return <div>Loading payment options...</div>;
  if (!clientId)
    return <div>PayPal configuration error: Missing Client ID</div>;

  return (
    <div className="paypal-button-container">
      {error && (
        <Alert
          message="Payment Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: "1rem" }}
        />
      )}
      {paymentStatus === "failed" && (
        <div style={{ marginBottom: "1rem" }}>
          <Alert
            message="Transaction Failed"
            description="Please try again or contact support if the problem persists."
            type="warning"
            showIcon
          />
        </div>
      )}
      <PayPalScriptProvider
        options={{
          "client-id": clientId,
          components: "buttons",
          currency: "USD",
          intent: "capture",
        }}
      >
        {paypalLoaded ? (
          <PayPalButtons
            className="paypal-iframe-container"
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            style={{ layout: "vertical" }}
            disabled={paymentStatus === "processing"}
          />
        ) : (
          <ConfigProvider theme={SpinnerTheme}>
            <Flex justify="center" align="center">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
              />
            </Flex>
          </ConfigProvider>
        )}
      </PayPalScriptProvider>{" "}
    </div>
  );
};

export default PaymentButton;
