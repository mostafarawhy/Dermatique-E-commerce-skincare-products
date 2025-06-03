import { Flex, Typography } from "antd";
import { useCartContext } from "../../hooks/useCartContext";

const { Text } = Typography;

const CheckoutSummaryItem = ({ image, id, name, quantity, price }) => {
  return (
    <Flex className="summary-item-wrapper">
      <img src={image} alt={`${name}`} className="summary-item-image" />
      <Flex className="summary-item-details">
        <Text className="summary-item-name">{name}</Text>
        <Text className="summary-item-price">{`${price} €`}</Text>
      </Flex>
    </Flex>
  );
};

export default CheckoutSummaryItem;
