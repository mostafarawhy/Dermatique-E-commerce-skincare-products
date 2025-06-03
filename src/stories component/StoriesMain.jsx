import React, { useState } from "react";
import { Flex, Typography, Pagination, ConfigProvider } from "antd";
import "./css/stories-main.css";
import story_1 from "../assets/stories-1.webp";
import story_2 from "../assets/stories-2.webp";
import story_3 from "../assets/stories-3.webp";
import story_4 from "../assets/stories-4.webp";
import story_5 from "../assets/stories-5.webp";
import story_6 from "../assets/stories-6.webp";
import StoryCard from "./StoryCard";

const { Text, Link } = Typography;

const StoriesMain = () => {
  return (
    <Flex vertical>
      <Flex className="title-wrapper">
        <Text className="title-text">STORIES</Text>
      </Flex>
      <Flex vertical className="stories-wrapper">
        <StoryCard image={story_1} />
        <StoryCard image={story_2} />
        <StoryCard image={story_3} />
        <StoryCard image={story_4} />
        <StoryCard image={story_5} />
        <StoryCard image={story_6} />
      </Flex>
    </Flex>
  );
};

export default StoriesMain;
