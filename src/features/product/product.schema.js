import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
  name: String,
  desc: String,
  imageUrl: String,
  category: String,
  price: Number,
  sizes: [{ type: String }],
  inStock: Number,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});
