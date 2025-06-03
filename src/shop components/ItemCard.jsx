import { Button, Flex, Typography } from "antd";
import "./css/shop-main.css";

import { useCartContext } from "../hooks/useCartContext";
import { useDrawerContext } from "../hooks/useDrawerContext";

const { Text } = Typography;

const ItemCard = ({ product, image, price, id }) => {
  const { addToCart } = useCartContext();
  const { toggleDrawer } = useDrawerContext();

  const handleAddToBag = () => {
    addToCart({
      _id: id,
      name: product,
      image: image,
      price: price,
    });
  };

  return (
    <Flex vertical className="product-card">
      <Flex className="product-image-wrapper">
        <img className="product-image" alt={product} src={image} />
      </Flex>
      <Flex className="product-title-wrapper">
        <Text className="product-name">{product}</Text>
        <Text className="product-price">{`${price}€`}</Text>
      </Flex>

      <Button
        type="primary"
        onClick={handleAddToBag}
        className="add-to-bag-btn"
      >
        Add to Bag
      </Button>
    </Flex>
  );
};

export default ItemCard;
