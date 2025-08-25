import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\../, "Please enter valid email"],
  },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        return /^(?=.*[^A-Za-z0-9]).{8,12}$/.test(value);
      },
      message:
        "Password should be between 8-12 characters & have a special character",
    },
  },
  type: { type: String, enum: ["Customer", "Seller"] },
});
