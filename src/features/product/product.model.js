import ApplicationError from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(name, desc, imageUrl, category, price, sizes) {
    this.name = name;
    this.desc = desc;
    this.imageUrl = imageUrl;
    this.category = category;
    this.price = price;
    this.sizes = sizes;
  }
}

let products = [
  new ProductModel(
    1,
    "Classic White T-Shirt",
    "A timeless white t-shirt made from 100% organic cotton.",
    "https://www.nextprint.in/cdn/shop/files/plainround_e14d1f6c-a7da-4033-9626-d782fe705a61.png?v=1713781466",
    "Clothing",
    499,
    ["S", "M", "L", "XL"]
  ),
  new ProductModel(
    2,
    "Running Shoes",
    "Lightweight running shoes with excellent grip and breathability.",
    "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png",
    "Footwear",
    2499,
    [7, 8, 9, 10]
  ),
  new ProductModel(
    3,
    "Stainless Steel Water Bottle",
    "Keeps your drink hot or cold for hours. Eco-friendly and durable.",
    "https://pexpo.in/cdn/shop/files/1_3a1bb5d1-5c57-4468-aab0-49993e020115.jpg?v=1753263660&width=1206",
    "Accessories",
    799,
    [500, 750, 1000] // sizes in ml
  ),
  new ProductModel(
    4,
    "Denim Jacket",
    "Classic denim jacket with a modern cut, perfect for all seasons.",
    "https://image.hm.com/assets/hm/fd/ea/fdead3e6016b3bcb1fb9ea4db6b3dc0cffe692dc.jpg?imwidth=1536",
    "Clothing",
    1999,
    ["M", "L", "XL"]
  ),
];
