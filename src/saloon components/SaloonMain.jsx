import { Button, Flex, Typography, ConfigProvider } from "antd";
import saloonPreview from "../assets/saloon-preview-1.webp";
import "./saloon.css";

const { Link, Text } = Typography;

const SaloonMain = () => {
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
      <Flex className="saloon-wrapper" vertical>
        <Flex vertical className="saloon-title-wrapper">
          <Text className="saloon-title-text">
            A Clean, Non-Toxic Salon Experience
          </Text>
        </Flex>
        <Flex className="saloon-wrapper">
          <Flex className="saloon-img-wrapper">
            <img className="saloon-img" src={saloonPreview} />
          </Flex>
          <Flex vertical>
            <Text className="saloon-desc">
              Enjoy our wide selection of high end nail colors, including
              Tenoverten, Chanel, Pleasing, J. Hannah, Mischa, FOR TMRW, CND
              Shellac, Dazzle Dry, Essie & Essie Gel Couture.
            </Text>
            <Button className="book-button" type="primary">
              Book your appointment
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default SaloonMain;
