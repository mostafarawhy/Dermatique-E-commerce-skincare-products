import { Button, Flex, Typography, ConfigProvider } from "antd";
import "./css/homeProducts.css";
import pic from "../assets/conscious-section-3-optimized.webp";
import { useEffect, useState } from "react";
import { client } from "../utils/api-clent";
import { useCartContext } from "../hooks/useCartContext";

const { Text } = Typography;

const dummyStories = [
  {
    id: 1,
    title: "Summer Vacation",
    previewImage: { pic },
    userAvatar: "/api/placeholder/40/40?text=John",
    userName: "John Doe",
  },
  {
    id: 1,
    title: "Summer Vacation",
    previewImage: { pic },
    userAvatar: "/api/placeholder/40/40?text=John",
    userName: "John Doe",
  },
  {
    id: 1,
    title: "Summer Vacation",
    previewImage: { pic },
    userAvatar: "/api/placeholder/40/40?text=John",
    userName: "John Doe",
  },
  {
    id: 1,
    title: "Summer Vacation",
    previewImage: { pic },
    userAvatar: "/api/placeholder/40/40?text=John",
    userName: "John Doe",
  },
];

const HomeProducts = () => {
  const [products, setProducts] = useState([]);

  const { addToCart } = useCartContext();

  useEffect(() => {
    client("products/get").then((response) => {
      const essentials = response.slice(0, 4);
      setProducts(essentials);
    });
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#B4ADA7",
          colorPrimaryHover: "#3B3535",
        },
        components: {
          Button: {
            primaryColor: "black",
            primaryHoverColor: "white",
            primaryHoverBg: "#3B3535",
          },
        },
      }}
    >
      <Flex className="product-fluid">
        <Flex
          vertical
          className="product-container"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Text className="product-section-title">ELegant Essentials</Text>
          <Flex className="product-list">
            {products.map((item) => (
              <Flex
                key={item._id}
                className="product-item"
                style={{ scrollSnapAlign: "start" }}
              >
                <Flex vertical className="product-card-wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="product-image"
                  />
                  <Flex className="product-card-content" vertical>
                    <Text className="product-card-title">{item.name}</Text>
                    <Text className="product-card-price">{`${item.price}€`}</Text>
                    <Button
                      onClick={() => {
                        addToCart({
                          _id: item._id,
                          name: item.name,
                          image: item.image,
                          price: item.price,
                        });
                      }}
                      type="primary"
                      className="product-button-add"
                    >
                      Add to Bag
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default HomeProducts;
