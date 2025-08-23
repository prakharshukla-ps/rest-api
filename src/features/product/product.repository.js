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
        // for operators & by default we have and operator
        // filterExpression = {
        //   $and: [{ category: { $in: category } }, filterExpression],
        // };
        filterExpression.category = category;
      }

      return await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, ratings: { $slice: 1 } })
        .toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  //   async rateProduct(userId, productId, rating) {
  //     try {
  //       const db = getDB();

  //       const collection = db.collection(this.collection);

  //       const product = await collection.findOne({
  //         _id: new ObjectId(productId),
  //       });

  //       const userRating = product?.ratings?.find(
  //         (rating) => rating.userId == userId
  //       );

  //       if (userRating) {
  //         await collection.updateOne(
  //           {
  //             _id: new ObjectId(productId),
  //             "ratings.userId": new ObjectId(userId),
  //           },
  //           {
  //             $set: {
  //               "ratings.$.rating": rating,
  //             },
  //           }
  //         );
  //       } else {
  //         await collection.updateOne(
  //           { _id: new ObjectId(productId) },
  //           { $push: { ratings: { userId: new ObjectId(userId), rating } } }
  //         );
  //       }
  //     } catch (err) {
  //       throw new ApplicationError("Something went wrong with database", 500);
  //     }
  //   }

  async rateProduct(userId, productId, rating) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const result = await collection.updateOne(
        {
          _id: new ObjectId(productId),
          "ratings.userId": new ObjectId(userId),
        },
        { $set: { "ratings.$.rating": rating } }
      );

      if (result.matchedCount == 0) {
        await collection.updateOne(
          { _id: new ObjectId(productId) },
          { $push: { ratings: { userId: new ObjectId(userId), rating } } }
        );
      }
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      // ********** Average rating per product **********

      // db.collection(this.collection).aggregate([
      //   { $unwind: "$ratings" },
      //   {
      //     $group: { _id: "$name", averageRating: { $avg: "$ratings.rating" } },
      //   },
      // ]);

      // ********** Rating count per product & sorting & getting product with max ratings **********

      // db.collection(this.collection).aggregate([
      //   {
      //     $project: {
      //       name: 1,
      //       countOfRating: {
      //         $size: {
      //           $cond: { if: { $isArray: "$ratings" } },
      //           then: { $size: "$ratings" },
      //           else: 0,
      //         },
      //       },
      //     },
      //   },
      //   {
      //     $sort: { countOfRating: -1 },
      //   },
      //   { $limit: 1 },
      // ]);

      return await collection
        .aggregate([
          { $group: { _id: "$category", averagePrice: { $avg: "$price" } } },
        ])
        .toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
