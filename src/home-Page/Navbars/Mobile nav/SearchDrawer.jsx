import { Drawer, Input, Flex, ConfigProvider, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dummyImage from "../../../assets/conscious-section-1-optimized.webp";
import "../../css/search-drawer.css";
import { useState } from "react";
import api from "../../../api";
import ItemCard from "../../../shop components/ItemCard";

const { Text } = Typography;
const { Search } = Input;

const SearchDrawer = ({ open, onClose }) => {
 
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {
    try {
      const response = await api.get(`/search/products`, {
        params: {
          q: value,
        },
      });
      setResults(response.data.products);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
      <Drawer
        style={{ background: "#d1cdc7", padding: 0 }}
        className="search-drawer-wrapper"
        placement="top"
        open={open}
        height={"60%"}
        zIndex={19}
      
      >
        <Flex vertical className="search-drawer-content">
          <Flex>
            <Text>Quick Search</Text>
          </Flex>
          <Search
            placeholder="Search products"
            enterButton={<SearchOutlined style={{ fontSize: "24px" }} />}
            size="large"
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="filled"
            onSearch={handleSearch}
            style={{
              marginBottom: "15px",
              height: "60px",
            }}
          />

          {/* Featured Products Section */}

          <Flex vertical>
            {results.length > 0 ? (
              <>
                <Text strong style={{ fontSize: "18px", marginBottom: "16px" }}>
                  Results
                </Text>
                <Flex
                  className="image-container"
                  align="center"
                  justify="space-between"
                >
                  {results.map((product) => (
                    <ItemCard
                      key={product._id}
                      id={product._id}
                      price={product.price}
                      product={product.name}
                      image={product.image}
                    />
                  ))}
                </Flex>
              </>
            ) : null}
          </Flex>
        </Flex>
      </Drawer>
    </ConfigProvider>
  );
};

export default SearchDrawer;
