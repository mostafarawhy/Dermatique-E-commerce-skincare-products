import { Flex, Typography } from "antd";

const ShopDropdown = () => {
  const bestSellerItems = [
    { label: "Product 1", link: "/shop/product1" },
    { label: "Product 2", link: "/shop/product2" },
    { label: "Product 3", link: "/shop/product3" },
    { label: "Product 4", link: "/shop/product4" },
    { label: "Product 5", link: "/shop/product5" },
  ];

  const newArrivalsItems = [
    { label: "New Product 1", link: "/shop/new-product1" },
    { label: "New Product 2", link: "/shop/new-product2" },
    { label: "New Product 3", link: "/shop/new-product3" },
    { label: "Product 4", link: "/shop/product4" },
    { label: "Product 5", link: "/shop/product5" },
  ];

  return (
    <Flex direction="vertical" className="shop-dropdown">
      <Flex className="shop-dropdown-menu"></Flex>
    </Flex>
  );
};

export default ShopDropdown;
