import { Flex, Typography } from "antd";
import "./css/quoteSection.css";

const { Text } = Typography;

const QouteSection = () => {
  return (
    <Flex className="quote-section-wrapper" vertical>
      <Flex vertical className="quote-section">
        <Text className="quote-text">
          “Oftentimes finding the best—and safest—products can invoke a sense of
          anxiety rather than well-being. Tenoverten’s founders have created a
          lineup of thoughtful nail-care essentials to simplify the process.”
        </Text>
        <Text className="quote-subtext">Vogue</Text>
      </Flex>
    </Flex>
  );
};

export default QouteSection;
