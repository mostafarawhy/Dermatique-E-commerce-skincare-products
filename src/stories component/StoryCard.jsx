import React, { useState } from "react";
import { Flex, Typography, Pagination, ConfigProvider } from "antd";
import "./css/stories-main.css";

const { Text, Link } = Typography;

const StoryCard = ({ image }) => {
  return (
    <Flex vertical className="card-wrapper">
      <Flex>
        <img src={image} />
      </Flex>
      <Flex>
        <Link>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis
        </Link>
      </Flex>
    </Flex>
  );
};

export default StoryCard;
