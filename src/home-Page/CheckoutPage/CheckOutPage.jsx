import { Flex, Typography, Collapse, message } from "antd";
import { useCartContext } from "../../hooks/useCartContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import CheckoutSummaryItem from "./CheckoutSummaryItem";
import DeliveryForm from "./css/DeliveryForm";
import PaymentButton from "./PaymentButton";
import CheckoutDetails from "./CheckoutDetails";
import "./css/checkout.css";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const CheckOutPage = () => {
  const { cartState, emptyCart } = useCartContext();
  const { state } = useAuthContext();
  const shippingCost = 26;
  const navigate = useNavigate();

  const handlePaymentSuccess = async (order) => {
    try {
      await emptyCart();
      message.success("Order completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error handling payment success:", error);
      message.error("Error processing order completion");
    }
  };

  const collapseItems = [
    {
      key: "1",
      label: (
        <Flex className="summary-colapse-details">
          <Text className="summary-colapse-text">Order summary</Text>
          <Text className="summary-colapse-text">
            ${(shippingCost + Number(cartState.totalPrice)).toFixed(2)}
          </Text>
        </Flex>
      ),
      children: (
        <>
          <Flex vertical>
            <Flex className="summary-checkout-wrapper" vertical>
              {cartState.items.map((item) => (
                <CheckoutSummaryItem
                  key={item._id}
                  quantity={item.quantity}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                  name={item.name}
                />
              ))}
            </Flex>
          </Flex>
          <Flex vertical>
            <Flex justify="space-between">
              <Text>Subtotal • {cartState.totalQuantity} items</Text>
              <Text>${cartState.totalPrice.toFixed(2)}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Shipping</Text>
              <Text>${shippingCost}</Text>
            </Flex>
            <Flex justify="space-between" style={{ marginTop: 10 }}>
              <Text strong>Total</Text>
              <Text strong>
                USD ${(shippingCost + Number(cartState.totalPrice)).toFixed(2)}
              </Text>
            </Flex>
          </Flex>
        </>
      ),
    },
  ];

  return (
    <Flex vertical>
      <Collapse
        style={{ padding: "20px 0" }}
        items={collapseItems}
        defaultActiveKey={[]}
      />

      {!state.user.deliveryInfo ? (
        <Flex vertical className="checkout-stripe-direct-wrapper">
          <DeliveryForm
            deliveryHeader={
              "Please enter your delivery info to complete your order ."
            }
            buttonText={"Proceed to checkout"}
          />
        </Flex>
      ) : (
        <Flex className="payment-section-wrapper" vertical>
          <CheckoutDetails />

          <PaymentButton
            amount={(shippingCost + Number(cartState.totalPrice)).toFixed(2)}
            onSuccess={handlePaymentSuccess}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default CheckOutPage;
