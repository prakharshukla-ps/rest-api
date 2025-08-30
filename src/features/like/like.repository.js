import mongoose from "mongoose";
import { LikeSchema } from "./like.schema.js";

const LikeModel = mongoose.model("Like", LikeSchema);

export default class LikeRepository {
  async likeProduct(user, likeable) {
    try {
      const newLike = new LikeModel({
        user,
        likeable,
        types: "Product",
      });

      await newLike.save();
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async likeCategory(user, likeable) {
    try {
      const newLike = new LikeModel({
        user,
        likeable,
        types: "Category",
      });

      await newLike.save();
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getLikes(type, id) {
    return await LikeModel.find({ likeable: id, types: type })
      .populate("user")
      //   .populate({ path: "likeable", model: type });
      .populate("likeable");
  }
}
