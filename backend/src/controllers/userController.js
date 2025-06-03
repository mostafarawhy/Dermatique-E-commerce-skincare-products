import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {

};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDeliveryInfo = async (req, res) => {
  try {
    const { country, city, apartment, phoneNumber } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          deliveryInfo: { country, city, apartment, phoneNumber },
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId;


    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.googleId) {
      await User.findByIdAndDelete(userId);

      res.clearCookie("token");
      return res.status(200).json({ message: "Account deleted successfully" });
    }


    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }


    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }


    await User.findByIdAndDelete(userId);


    res.clearCookie("token");

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error); 
    res.status(500).json({
      message: "Error deleting account",
      error: error.message,
    });
  }
};
