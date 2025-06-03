import { Flex, Typography } from "antd";
import PropTypes from "prop-types";
import "./css/shop-dropdown.css";

const { Link } = Typography;

const DropDownMenuItem = ({ title, items }) => {
  return (
    <Flex vertical className="dropdown-menu-item-list-wrapper">
      <Link className="dropdown-menu-item-title">{title}</Link>
      <Flex vertical>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <Link href={item.link}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </Flex>
    </Flex>
  );
};

DropDownMenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DropDownMenuItem;
