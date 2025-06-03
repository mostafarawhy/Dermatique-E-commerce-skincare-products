import { Button, Card, ConfigProvider, Flex, Typography } from "antd";
import "./css/productCard.css";

const { Text } = Typography;

const ProductCard = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#B4ADA7",
          colorPrimaryHover: "#3B3535",
          borderRadius: 0,
        },
        components: {
          Button: {
            primaryColor: "black",
            primaryHoverColor: "white",
            primaryHoverBg: "#3B3535",
            controlHeight: 80,
          },
        },
      }}
    >
      <Card
        hoverable
        style={{
          width: 300, 
          backgroundColor: "#d1cdc7",
          border: "none",
        }}
        cover={
          <img
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
        }
      >
        <Flex vertical>
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            style={{
              flexWrap: "nowrap",
              alignContent: "center",
              padding: "15px 0",
            }}
          >
            <Text style={{ flexWrap: "nowrap", fontSize: "1rem" }}>
              The Custom Trio
            </Text>
            <Text style={{ flexWrap: "nowrap", fontSize: "0.7rem" }}>$35</Text>
          </Flex>

          <Button type="primary">ADD TO BAG</Button>
        </Flex>
      </Card>
    </ConfigProvider>
  );
};

export default ProductCard;
