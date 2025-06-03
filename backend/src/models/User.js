import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, sparse: true, unique: true },
    fullName: { type: String },
    profilePicture: { type: String },
    createdAt: { type: Date, default: Date.now },
    deliveryInfo: {
      country: String,
      city: String,
      apartment: String,
      phoneNumber: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
  },
  { collection: "users", timestamps: true }
);


userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
