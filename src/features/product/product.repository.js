import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

export default class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async addProduct(newProduct) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      await collection.insertOne(newProduct);

      return newProduct;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAllProducts() {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      return await collection.find().toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getSingleProduct(id) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async filterProducts(minPrice, maxPrice, category) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      let filterExpression = {};

      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }

      return await collection.find(filterExpression).toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async rateProduct(userId, productId, rating) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      collection.updateOne(
        { _id: new ObjectId(productId) },
        { $push: { ratings: { userId: new ObjectId(userId), rating } } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
