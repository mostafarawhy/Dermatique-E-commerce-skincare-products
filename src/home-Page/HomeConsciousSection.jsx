import { Flex, Typography } from "antd";
import imageSection1 from "../assets//conscious-section-1-optimized.webp";
import imageSection2 from "../assets/conscious-section-2-optmized.webp";
import imageSection3 from "../assets/conscious-section-3-optimized.webp";
import "./css/homeConscious.css";

const { Text } = Typography;

const HomeConsciousSection = () => {
  return (
    <>
      <Flex>
        <Text className="conscious-title">Conscious beauty.</Text>
      </Flex>

      <Flex vertical className="conscious-items-wrapper">
        <Flex className="left-conscious-card" vertical>
          <Text className="left-conscious-text">01 – Less is more.</Text>

          <img
            loading="lazy"
            className="conscious-image"
            src={imageSection1}
            alt="Section 1"
          />
          <Text className="conscious-quote">
            “In anything at all, perfection is finally attained not when there
            is no longer anything to add, but when there is no longer anything
            to take away.” Antoine de Saint Exupéry
          </Text>
        </Flex>
        <Flex className="right-conscious-items" vertical>
          <Flex className="top-right-conscious-card">
            <Flex vertical>
              <Text className="right-conscious-text">
                {" "}
                02 – A hands-on approach.
              </Text>
              <img
                loading="lazy"
                className="right-conscious-image"
                src={imageSection2}
                alt="Section 2"
              />
            </Flex>
            <Text className="right-top-conscious-quote">
              In 2010, we opened the first nail salon where less is more. A
              thoughtfully designed space that’s less about getting your nails
              “done” and more about caring for yourself and the world around you
              with formulas that cleanse, nourish, color, and gloss, all without
              harmful ingredients. It was a beautiful beginning, one that led to
              additional spaces—each one unique.
            </Text>
          </Flex>
          <Flex className="bottom-right-conscious-card">
            <Text className="right-bottom-conscious-quote">
              When we set out to create products that make it possible to bring
              the Tenoverten salon experience home, non-toxic was a necessity,
              and so were salon-quality results. Our formulas are not only
              “eight-free” (no dibutyl phthalate, toluene, formaldehyde,
              formaldehyde resin, camphor, ethyl tosylamide, xylene, or
              triphenyl phosphate) but also cruelty free and vegan.
            </Text>
            <Flex vertical>
              <Text className="right-conscious-text">03 – A better way.</Text>
              <img
                loading="lazy"
                className="right-conscious-image"
                src={imageSection3}
                alt="Section 3"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default HomeConsciousSection;
