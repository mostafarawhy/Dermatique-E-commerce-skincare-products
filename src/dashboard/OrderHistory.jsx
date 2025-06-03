import { useEffect, useState } from "react";
import {
  Flex,
  Typography,
  Badge,
  List,
  Avatar,
  Tag,
  Spin,
  ConfigProvider,
} from "antd";
import { LoadingOutlined, ShoppingOutlined } from "@ant-design/icons";
import api from "../api";
import "./css/orderHistory.css";
import { SpinnerTheme } from "../constants";

const { Text } = Typography;

const OrderHistory = ({ open }) => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders", { withCredentials: true });
      setOrders(response.data.orders || []);
      setTotalOrders(response.data.totalOrders || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open === "orderHistory") {
      fetchOrders();
    }
  }, [open]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (open !== "orderHistory") return null;
  if (loading) {
    return (
      <ConfigProvider theme={SpinnerTheme}>
        <Flex
          justify="center"
          align="center"
          style={{ backgroundColor: "#d1cdc7", height: "40vh", width: "100%" }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />} />
        </Flex>
      </ConfigProvider>
    );
  }

  return (
    <Flex vertical className="order-history-wrapper">
      <Flex className="order-number-wrapper">
        <Text className="total-order-number">Total Orders : {totalOrders}</Text>
        <ShoppingOutlined className="total-order-number" />
      </Flex>
      <Flex vertical className="orders-cards-wrapper">
        {orders.length > 0 &&
          orders.map((order) => (
            <Flex vertical className="order-card" key={order.orderId}>
              <Flex className="order-card-header-wrapper">
                <Text className="order-header-id">
                  Order #{order.orderId.slice(-8)}
                </Text>
                <Text className="order-header-status">
                  {`Status : ${order.status === "COMPLETED" && "Pending"}`}{" "}
                </Text>
              </Flex>
              <Flex className="order-summary-header-wrapper">
                <Text className="order-summary-text">
                  Date: {formatDate(order.createdAt)}
                </Text>
                <Text className="order-summary-text">
                  Total Price: ${order.totalAmount.toFixed(2)}
                </Text>
              </Flex>

              {/* Replaced List with Flex + map */}
              <Flex vertical className="order-items-wrapper">
                {order.items.map((item) => (
                  <Flex key={item.name} className="order-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 64, height: 64, objectFit: "cover" }}
                    />
                    <Flex vertical className="order-item-data">
                      <Text>{item.name}</Text>
                      <Flex vertical>
                        <Text>Quantity: {item.quantity}</Text>
                        <Text>Price: ${item.price.toFixed(2)}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                ))}
              </Flex>

              <Flex className="order-delivery-info-wrapper">
                <Text>Shipping Information:</Text>
                <Text>{order.shippingInfo.apartment}</Text>
                <Text>
                  {order.shippingInfo.city}, {order.shippingInfo.country}
                </Text>
                <Text>{`Phone: +${order.shippingInfo.phoneNumber}`}</Text>
              </Flex>

              <Flex className="order-tags-wrapper" vertical>
                <Tag color="blue">PayPal ID: {order.paypalOrderId}</Tag>
                <Tag color="cyan">Customer: {order.user.username}</Tag>
              </Flex>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};

export default OrderHistory;
