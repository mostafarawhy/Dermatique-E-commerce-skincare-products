import { Button, Flex, Typography, ConfigProvider } from "antd";
import nailCustomedOne from "../assets/nails-customed-compressed-1.webp";
import nailCustomedTwo from "../assets/nails-customed-compressed-2.jpg";
import "./css/customized-Nails.css";

const { Text } = Typography;

const NailCutomed = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#B4ADA7",
          colorPrimaryHover: "#3B3535",
          borderRadius: 8,
        },
        components: {
          Button: {
            primaryColor: "black",
            primaryHoverColor: "white",
            primaryHoverBg: "#3B3535",
            controlHeight: 40,
          },
        },
      }}
    >
      <Flex className="customized-section-wrapper">
        <Flex className="customized-content-container" vertical>
          <Text className="customized-title">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi ab
            eaque laboriosam doloremque
          </Text>
          <Flex className="preview-cards-container">
            <Flex className="preview-card" vertical>
              <img
                className="preview-img"
                src={nailCustomedOne}
                alt="nails-image"
              />
              <Text className="previw-card-text">
                Lorem ipsum dolor sit amet consectetur
              </Text>
            </Flex>
            <Flex className="preview-card" vertical>
              <img
                className="preview-img"
                src={nailCustomedTwo}
                alt="nails-image"
              />
              <Text className="previw-card-text">
                Lorem ipsum dolor sit amet consectetur
              </Text>
            </Flex>
          </Flex>
          <Button
            className="customize-button"
            style={{ marginTop: "30px" }}
            type="primary"
          >
            Customize yours
          </Button>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default NailCutomed;
