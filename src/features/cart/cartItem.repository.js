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

      await collection.insertOne({
        productId: new ObjectId(productId),
        userId: new ObjectId(userId),
        quantity,
      });
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
    const cartItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id == cartItemId && cartItem.userId == userId
    );

    if (cartItemIndex == -1) {
      return "Item not found";
    } else {
      cartItems.splice(cartItemIndex, 1);
    }
  }
}
