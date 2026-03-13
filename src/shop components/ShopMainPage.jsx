import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Flex,
  Typography,
  Pagination,
  ConfigProvider,
  Spin,
  AutoComplete,
  Input,
  Button,
  message,
} from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import ItemCard from "./ItemCard";
import useScrollToTop from "../hooks/useScrollToTop";
import api from "../api";
import { ShopTheme, SpinnerTheme } from "../constants";
import "./css/shop-main.css";
import { useSearchContext } from "../hooks/useSearchContext";

const { Text } = Typography;

const ShopMainPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 12;
  const { scrollToTop } = useScrollToTop();
  const { state, handleSearch, debouncedSearch, clearSearch, setSearchQuery } =
    useSearchContext();

  const formattedSuggestions = (state.suggestions || []).map((item) => ({
    value: item.name,
    label: (
      <Flex align="center" justify="space-between" style={{ width: "100%" }}>
        <Text style={{ marginRight: 8 }}>{item.name}</Text>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          in {item.category}
        </Text>
      </Flex>
    ),
  }));

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/products/get");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        message.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelect = (value) => {
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleInputChange = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    clearSearch();
    setCurrentPage(1);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const onPageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      scrollToTop();
    },
    [scrollToTop],
  );

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const currentData = state.results.length > 0 ? state.results : products;
    return currentData.slice(startIndex, startIndex + pageSize);
  }, [currentPage, state.results, products]);

  const totalItems = useMemo(
    () => (state.results.length > 0 ? state.results.length : products.length),
    [products, state.results],
  );

  if (loading) {
    return (
      <ConfigProvider theme={SpinnerTheme}>
        <Flex
          justify="center"
          align="center"
          style={{ backgroundColor: "#d1cdc7", height: "100vh" }}
        >
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 180 }} spin />}
          />
        </Flex>
      </ConfigProvider>
    );
  }

  if (error) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ backgroundColor: "#d1cdc7", height: "100vh" }}
      >
        <Text type="danger" style={{ fontSize: "18px" }}>
          {error}
        </Text>
      </Flex>
    );
  }

  return (
    <ConfigProvider theme={ShopTheme}>
      <Flex className="shop-main-wrapper" vertical>
        <Flex style={{ width: "100%" }}>
          <AutoComplete
            placeholder="Search products"
            value={state.searchQuery}
            options={formattedSuggestions}
            onSelect={handleSelect}
            onChange={handleInputChange}
            onSearch={handleInputChange}
            notFoundContent={
              state.searchLoading ? <Spin size="small" /> : "No suggestions"
            }
            style={{ width: "100%" }}
          >
            <Input.Search
              enterButton={<SearchOutlined style={{ fontSize: "24px" }} />}
              size="large"
              loading={state.searchLoading}
            />
          </AutoComplete>
        </Flex>

        <Flex
          className="title-container"
          justify="space-between"
          align="center"
        >
          <Button
            type="primary"
            onClick={handleClearSearch}
            className="title"
            style={{ padding: "30px" }}
          >
            Shop All
          </Button>
        </Flex>

        {totalItems > 0 && (
          <Pagination
            className="pagination-top"
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={onPageChange}
            style={{ marginBottom: "20px" }}
            showSizeChanger={false}
          />
        )}

        <Flex className="product-grid">
          {currentPageData.map((product) => (
            <ItemCard
              key={product._id}
              id={product._id}
              price={product.price}
              product={product.name}
              image={product.image}
            />
          ))}
        </Flex>

        {totalItems > 0 && (
          <Flex justify="center" className="pagination-bottom">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </Flex>
        )}
      </Flex>
    </ConfigProvider>
  );
};

export default ShopMainPage;
