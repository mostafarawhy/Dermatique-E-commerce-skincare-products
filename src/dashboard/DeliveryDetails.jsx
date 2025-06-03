import { Button, Flex, Typography, Modal } from "antd";
import DeliveryForm from "../home-Page/CheckoutPage/css/DeliveryForm";
import { useAuthContext } from "../hooks/useAuthContext";
import { EditFilled } from "@ant-design/icons";
import { useState } from "react";

const { Text } = Typography;

const DeliveryDetails = ({ open }) => {
  const { state } = useAuthContext();
  const [editDeliveryOpen, setEditDeliveryOpen] = useState(false);
  const { user } = state;

  if (open === "profileDetails") {
    return (
      <>
        <Flex vertical className="detail-wrapper">
          <Text className="details-text">{`User name : ${user.username}`}</Text>
          <Text className="details-text">{`Email : ${user.email}`}</Text>
          {!user.deliveryInfo ? (
            <Flex>
              <DeliveryForm
                deliveryHeader="Please Fill your delivery address and phone number."
                buttonText="Add delivery address"
              />
            </Flex>
          ) : (
            <>
              <Flex>
                <Text className="details-text">{`Address : ${user.deliveryInfo.country}, ${user.deliveryInfo.city}, ${user.deliveryInfo.apartment}`}</Text>
                <Button onClick={() => setEditDeliveryOpen(true)} type="ghost">
                  <EditFilled />
                </Button>
              </Flex>
              <Text className="details-text">{`Phone : +${user.deliveryInfo.phoneNumber}`}</Text>
            </>
          )}
        </Flex>

        <Modal
          title="Edit Delivery Information"
          open={editDeliveryOpen}
          onCancel={() => setEditDeliveryOpen(false)}
          footer={null}
          destroyOnClose={true}
        >
          <DeliveryForm
            deliveryHeader="Update your delivery information"
            buttonText="Update delivery address"
            initialValues={user.deliveryInfo}
            onSuccess={() => setEditDeliveryOpen(false)}
          />
        </Modal>
      </>
    );
  }
  return null;
};

export default DeliveryDetails;
