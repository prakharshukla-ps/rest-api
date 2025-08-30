import mongoose from "mongoose";
import ApplicationError from "../../error-handler/applicationError.js";
import { UserSchema } from "./user.schema.js";

const UserModel = mongoose.model("User", UserSchema);

export default class UserRepository {
  async signUp(user) {
    try {
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong with database", 500);
      }
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async resetPassword(userId, newPassword) {
    try {
      const user = await UserModel.findById(userId);
      if (user) {
        user.password = newPassword;
        await user.save();
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
