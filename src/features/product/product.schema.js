import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
  name: String,
  desc: String,
  imageUrl: String,
  category: String,
  price: Number,
  sizes: String,
  inStock: Number,
});
