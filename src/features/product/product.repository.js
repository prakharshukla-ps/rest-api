import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { ProductSchema } from "./product.schema.js";
import { ReviewSchema } from "./review.schema.js";
import { CategorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", ProductSchema);
const ReviewModel = mongoose.model("Review", ReviewSchema);
const CategoryModel = mongoose.model("Category", CategorySchema);
export default class ProductRepository {
  constructor() {
    this.collection = "Product";
  }

  async addProduct(productData) {
    try {
      productData.categories = productData.category
        .split(",")
        .map((category) => category.trim());
      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save();

      await CategoryModel.updateMany(
        { _id: { $in: productData.categories } },
        { $push: { products: savedProduct._id } }
      );
      // const db = getDB();

      // const collection = db.collection(this.collection);

      // await collection.insertOne(newProduct);

      // return newProduct;
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

  // async rateProduct(userId, productId, rating) {
  //   try {
  //     const db = getDB();

  //     const collection = db.collection(this.collection);

  //     const result = await collection.updateOne(
  //       {
  //         _id: new ObjectId(productId),
  //         "ratings.userId": new ObjectId(userId),
  //       },
  //       { $set: { "ratings.$.rating": rating } }
  //     );

  //     if (result.matchedCount == 0) {
  //       await collection.updateOne(
  //         { _id: new ObjectId(productId) },
  //         { $push: { ratings: { userId: new ObjectId(userId), rating } } }
  //       );
  //     }
  //   } catch (err) {
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  async rateProduct(userId, productId, rating) {
    try {
      const productToUpdate = await ProductModel.findById(productId);

      if (!productToUpdate) {
        throw new Error("Product not found!");
      }

      const userReview = await ReviewModel.findOne({
        productId: productId,
        userId: userId,
      });

      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          productId: productId,
          userId: userId,
          rating,
        });

        await newReview.save();

        productToUpdate.reviews.push(newReview._id);
        await productToUpdate.save();
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
