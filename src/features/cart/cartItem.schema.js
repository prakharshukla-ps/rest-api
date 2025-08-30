import mongoose from "mongoose";

export const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quantity: Number,
});
