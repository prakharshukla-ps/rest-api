import mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema({
  name: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});
