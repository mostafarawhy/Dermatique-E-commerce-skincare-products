import axios from "axios";
import { createOrder } from "./orderController.js";

const { DERMATIQUE_APP_PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const generateAccessToken = async () => {
  try {
    console.log("Generating access token...");
    const auth = Buffer.from(
      DERMATIQUE_APP_PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await axios.post(
      `${base}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw new Error("PayPal authentication failed");
  }
};

export const createPayPalOrder = async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    if (!accessToken) {
      throw new Error("Failed to generate access token");
    }

    const url = `${base}/v2/checkout/orders`;
    const roundedAmount = Number(req.body.amount).toFixed(2);
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: roundedAmount,
          },
        },
      ],
    };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Failed to create PayPal order:", error);
    res.status(500).json({
      error: true,
      message: "Failed to create PayPal order",
      details: error.response?.data || error.message,
    });
  }
};

export const capturePayment = async (req, res) => {
  let accessToken;
  try {

    const { orderID } = req.body;
    if (!orderID) {
      return res.status(400).json({
        error: true,
        message: "Order ID is required",
      });
    }


    accessToken = await generateAccessToken();

    try {

      const captureResponse = await axios.post(
        `${base}/v2/checkout/orders/${orderID}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );


      const orderData = await createOrder(
        captureResponse.data,
        req.user.userId
      );
      return res.json({
        success: true,
        order: orderData,
        status: "COMPLETED",
      });
    } catch (captureError) {

      if (
        captureError.response?.data?.details?.[0]?.issue ===
        "COMPLIANCE_VIOLATION"
      ) {
        try {

          const orderDetails = await axios.get(
            `${base}/v2/checkout/orders/${orderID}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );


          const orderData = await createOrder(
            {
              id: orderID,
              status: "COMPLETED",
              payer: orderDetails.data.payer,
            },
            req.user.userId
          );

          return res.json({
            success: true,
            order: orderData,
            status: "COMPLETED",
          });
        } catch (detailsError) {
          console.error("Failed to fetch order details:", detailsError);
          return res.status(500).json({
            error: true,
            message: "Failed to process order after compliance check",
            details: detailsError.message,
          });
        }
      }


      console.error("Payment capture failed:", captureError);
      return res.status(500).json({
        error: true,
        message: "Payment capture failed",
        details: captureError.response?.data?.message || captureError.message,
      });
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      error: true,
      message: "Payment processing failed",
      details: error.message,
    });
  }
};

export default { createPayPalOrder, capturePayment };
