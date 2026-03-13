import { Button, Flex, Input, Typography, message, Modal } from "antd";
import "./css/dashboard.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DeliveryDetails from "./DeliveryDetails";
import OrderHistory from "./OrderHistory";

const { Text } = Typography;

const DashBoard = () => {
  const { logout, state, deleteAccount } = useAuthContext();
  const { user } = state;
  const [openedBox, setOpenedBox] = useState("profileDetails");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (user.googleId) {
      setDeletePassword("confirm");
    } else if (!deletePassword) {
      message.error("Please enter your password");
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteAccount(deletePassword);
      if (success) {
        setIsDeleteModalOpen(false);
        navigate("/");
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsDeleting(false);
      setDeletePassword("");
    }
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  };

  const handleCustomerServiceCall = () => {
    const phoneNumber = "+1234567890";
    if (isMobile()) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      message.info(`Call ${phoneNumber} for customer service`);
    }
  };
  useEffect(() => {}, [state, user]);
  return (
    <Flex className="dashboard-wrapper">
      <Flex className="user-welcome-wrapper">
        <Text className="header-user-text">{`Welcome ${
          user.username.split(" ")[0]
        } !`}</Text>
      </Flex>
      <Flex className="buttons-wrapper">
        <Flex vertical className="right-buttons-wrapper">
          <Button
            type="ghost"
            style={{ textWrap: "wrap" }}
            className="user-text"
            onClick={() => setOpenedBox("profileDetails")}
          >
            Profile Details
          </Button>
          <Button
            type="ghost"
            style={{ textWrap: "wrap" }}
            className="user-text"
            onClick={() => setOpenedBox("orderHistory")}
          >
            Order History
          </Button>
        </Flex>
        <Flex vertical className="left-buttons-wrapper">
          <Button
            type="ghost"
            style={{ textWrap: "wrap" }}
            className="user-text"
            onClick={handleCustomerServiceCall}
          >
            Customer service
          </Button>
          <Button
            type="ghost"
            style={{ textWrap: "wrap" }}
            className="user-text"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button
            type="ghost"
            danger
            style={{ textWrap: "wrap" }}
            className="user-text"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </Button>
        </Flex>
      </Flex>

      <Modal
        title="Delete Account"
        open={isDeleteModalOpen}
        onOk={handleDeleteAccount}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletePassword("");
        }}
        okText={"Delete"}
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          loading: isDeleting,
        }}
      >
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        {!user.googleId ? (
          <Input.Password
            placeholder={"Enter your password to confirm"}
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            style={{ marginTop: 16 }}
          />
        ) : null}
      </Modal>

      <DeliveryDetails open={openedBox} />
      <OrderHistory open={openedBox} />
    </Flex>
  );
};

export default DashBoard;
