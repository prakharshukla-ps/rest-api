import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export default class CartItemRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async addItem(productId, userId, quantity) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const id = await this.getNextCounter(db);

      await collection.updateOne(
        {
          productId: new ObjectId(productId),
          userId: new ObjectId(userId),
        },
        { $setOnInsert: { _id: id }, $inc: { quantity: quantity } },
        { upsert: true }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAllCartItems(userId) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const allCartItems = await collection
        .find({ userId: new ObjectId(userId) })
        .toArray();

      return allCartItems;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async deleteCartItem(cartItemId, userId) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const result = await collection.deleteOne({
        userId: new ObjectId(userId),
        _id: new ObjectId(cartItemId),
      });

      return result.deletedCount > 0;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getNextCounter(db) {
    const counter = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );

    return counter.value;
  }
}
