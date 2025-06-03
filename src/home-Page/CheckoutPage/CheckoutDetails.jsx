import { Flex, Typography } from "antd";
import { useAuthContext } from "../../hooks/useAuthContext";
import PaymentButton from "./PaymentButton";

const { Text } = Typography;

const CheckoutDetails = () => {
  const { state } = useAuthContext();
  const { phoneNumber, apartment, city, country } = state.user.deliveryInfo;

  return (
    <Flex className="checkout-details-wrapper" vertical>
      <Text className="checkout-details-header">Delivery details</Text>
      <Flex className="checkout-details-final" vertical>
        <Text className="checkout-delivery-details">{`Reciever's Name : ${state.user.username} `}</Text>
        <Text className="checkout-delivery-details">{`Delivery adress : ${country}, ${city}, ${apartment} `}</Text>
        <Text className="checkout-delivery-details">{`Phone number: +${phoneNumber} `}</Text>
      </Flex>
    </Flex>
  );
};

export default CheckoutDetails;
