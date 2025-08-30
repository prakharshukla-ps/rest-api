import mongoose from "mongoose";
import { CategorySchema } from "../features/product/category.schema.js";

const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Mongodb connected using mongoose");
    addCategories();
  } catch (error) {
    console.log(err);
  }
};

async function addCategories() {
  const CategoryModel = mongoose.model("Category", CategorySchema);
  const categories = await CategoryModel.find();
  if (!categories || categories.length == 0) {
    await CategoryModel.insertMany([
      { name: "Books" },
      { name: "Clothing" },
      { name: "Electronics" },
    ]);
  }
  console.log("Categories are added");
}
