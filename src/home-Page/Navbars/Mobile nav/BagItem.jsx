import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const BagItem = ({ id, price, product, image, quantity, update, remove }) => {
  const handleRemove = () => {
    remove(id);
  };

  return (
    <Flex vertical className="item-container">
      <img src={image} alt={`${product}`} className="item-img" />
      <Flex className="item-details">
        <Flex>
          <Text className="item-title">{`${product}`}</Text>
        </Flex>
        <Text className="item-quantity">{`${quantity} x ${price} € `}</Text>
        <Flex className="adds-buttons-container">
          <Button
            type="primary"
            style={{
              fontSize: "2px",
            }}
            onClick={() => {
              update(id, -1);
            }}
          >
            -1
          </Button>
          <Button
            type="primary"
            style={{
              fontSize: "2px",
            }}
            onClick={() => {
              update(id, 1);
            }}
          >
            +1
          </Button>
        </Flex>
        <Tooltip title="Remove Item">
          <Button
            className="remove-button"
            ghost="true"
            icon={
              <DeleteOutlined
                ghost="true"
                style={{
                  fontSize: "1.4rem",
                  color: "black",
                }}
              />
            }
            onClick={handleRemove}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default BagItem;
