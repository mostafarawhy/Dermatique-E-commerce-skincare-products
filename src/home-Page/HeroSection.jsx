import { Flex, Typography } from "antd";
import "../home-Page/css/heroSection.css";
import pic from "../assets/skincare-background-resized-optimized.webp";

const { Text } = Typography;

const HeroSection = () => {
  return (
    <Flex vertical className="home-background-section">
      <Flex className="hero-left">
        <img
          src={pic}
          alt="Skincare background"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Flex>
      <Flex vertical className="hero-right">
        <Flex vertical className="hero-right-info-wrapper">
          <h1 className="hero-right-title">Buy Better, Not More.</h1>
          <Text className="hero-right-text">
            Our tools are an investment, but we believe in buying better, not
            more. They are salon-quality and made to last a lifetime. Crafted in
            Germany with scratch-resistant stainless steel that repels water,
            oil & bacteria.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeroSection;
