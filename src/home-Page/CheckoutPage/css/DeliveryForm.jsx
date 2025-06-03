import { DollarCircleOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Flex,
  Form,
  Input,
  message,
  Typography,
  Select,
} from "antd";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCartContext } from "../../../hooks/useCartContext";
import { City, Country } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import api from "../../../api/index";
import { useEffect, useState, useMemo } from "react";

const { Item } = Form;
const { Text } = Typography;

const DeliveryForm = ({
  buttonText,
  deliveryHeader,
  initialValues,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { state, getCurrentUser } = useAuthContext();
  const { cartState } = useCartContext();

  const countries = useMemo(() => {
    return Country.getAllCountries()
      .map((country) => ({
        value: country.isoCode,
        label: country.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (selectedCountry) {
      const countryCities = City.getCitiesOfCountry(selectedCountry) || [];
      setCities(
        countryCities
          .map((city) => ({
            value: city.name,
            label: city.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (initialValues) {
      const country = countries.find(
        (c) => c.label.toLowerCase() === initialValues.country.toLowerCase()
      );

      if (country) {
        setSelectedCountry(country.value);
        form.setFieldsValue({
          ...initialValues,
          country: country.value,
        });
      }
    }
  }, [initialValues, countries, form]);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    form.setFieldsValue({
      city: undefined,
    });
  };

  const onFinish = async (values) => {
    try {
      const countryName = countries.find(
        (c) => c.value === values.country
      )?.label;
      const formattedValues = {
        ...values,
        country: countryName,
      };

      if (state.isAuthenticated) {
        const response = await api.post(
          "/users/update-delivery-info",
          formattedValues,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        await getCurrentUser();
        message.success("Delivery information saved successfully");

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      message.error("Failed to save delivery information");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#B4ADA7",
          colorPrimaryHover: "#3B3535",
          borderRadius: 8,
        },
        components: {
          Button: {
            primaryColor: "black",
            primaryHoverColor: "white",
            primaryHoverBg: "#3B3535",
            controlHeight: 50,
          },
        },
      }}
    >
      <Flex>
        <Flex
          className="checkout-delivery-wrapper"
          vertical
          style={{ width: "100%" }}
        >
          <Text className="header-text">{deliveryHeader}</Text>
          <Form
            form={form}
            name="delivery"
            onFinish={onFinish}
            layout="vertical"
            style={{ width: "100%" }}
          >
            <Item
              name="country"
              rules={[
                {
                  required: true,
                  message: "Please select your country!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select your country"
                size="large"
                onChange={handleCountryChange}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                options={countries}
              />
            </Item>

            <Item
              name="city"
              rules={[
                {
                  required: true,
                  message: "Please select your city!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder={
                  selectedCountry
                    ? "Select your city"
                    : "Please select a country first"
                }
                size="large"
                disabled={!selectedCountry}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                options={cities}
              />
            </Item>

            <Item
              name="apartment"
              rules={[
                {
                  required: true,
                  message: "Please input your street and apartment info!",
                },
              ]}
            >
              <Input
                placeholder="Street and apartment, suite, etc..."
                size="large"
              />
            </Item>

            <Item
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <PhoneInput
                country={selectedCountry?.toLowerCase()}
                enableSearch={true}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            </Item>

            <Item>
              <Button type="primary" htmlType="submit" block>
                {buttonText}
                {buttonText === "Proceed to checkout" && (
                  <DollarCircleOutlined />
                )}
              </Button>
            </Item>
          </Form>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default DeliveryForm;
