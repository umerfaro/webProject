// models/userModel.js
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSeller: {
      type: Boolean,
      required: true,
      default: false,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows multiple docs with null googleId
    },
    avatar: {
      type: String,
      required: false,
    },
    // Add other fields as necessary
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
