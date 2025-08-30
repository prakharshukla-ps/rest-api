import mongoose from "mongoose";

export const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likeable: { type: mongoose.Schema.Types.ObjectId, refPath: "types" },
  types: { type: String, enum: ["Product", "Category"] },
});
