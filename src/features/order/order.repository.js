import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();

    try {
      const db = getDB();
      session.startTransaction();

      //   1. Get cart items & calculate total amount
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => (acc += item.totalAmount),
        0
      );
      console.log("finalTotalAmount", finalTotalAmount);

      //   2. Create new order
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });

      //   3. Reduce the stock
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      // 4. Clear cart items
      await db
        .collection("cartItems")
        .deleteMany({ userId: new ObjectId(userId) }, { session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    } finally {
      session.endSession();
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();

    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          { $match: { userId: new ObjectId(userId) } },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },
          {
            $addFields: {
              totalAmount: { $multiply: ["$productInfo.price", "$quantity"] },
            },
          },
        ],
        { session }
      )
      .toArray();

    return items;
  }
}
