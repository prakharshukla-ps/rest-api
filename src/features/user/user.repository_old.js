import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

export default class UserRepository {
  constructor() {
    this.collection = "users";
  }

  async signUp(newUser) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      await collection.insertOne(newUser);

      return newUser;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      return await collection.findOne({ email });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAllUsers() {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      return await collection.find().toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
