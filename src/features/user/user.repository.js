import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

export default class UserRepository {
  async signUp(newUser) {
    try {
      const db = getDB();

      const collection = db.collection("users");

      await collection.insertOne(newUser);

      return newUser;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      const db = getDB();

      const collection = db.collection("users");

      return await collection.findOne({ email });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
