import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(id, name, desc, imageUrl, category, price, sizes) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.imageUrl = imageUrl;
    this.category = category;
    this.price = price;
    this.sizes = sizes;
  }

  static getAllProducts() {
    return products;
  }

  static addProduct(product) {
    const { name, desc, imageUrl, category, price, sizes } = product;

    const newProduct = new ProductModel(
      products.length + 1,
      name,
      desc,
      imageUrl,
      category,
      price,
      sizes
    );

    products.push(newProduct);

    return newProduct;
  }

  static getSingleProduct(id) {
    const product = products.find((product) => product.id == id);

    return product;
  }

  static filterProducts(minPrice, maxPrice, category) {
    const filteredProducts = products.filter(
      (product) =>
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice) &&
        (!category || product.category == category)
    );

    return filteredProducts;
  }

  static rateProduct(userId, productId, rating) {
    const user = UserModel.getAllUsers().find((user) => user.id == userId);

    if (!user) {
      return "User not found";
    }

    const product = products.find((product) => product.id == productId);

    if (!product) {
      return "Product not found";
    }

    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({ userId, rating });
    } else {
      const existingRatingIndex = product.ratings.findIndex(
        (rating) => rating.userId == userId
      );

      if (existingRatingIndex >= 0) {
        product.ratings[existingRatingIndex] = { userId, rating };
      } else {
        product.ratings.push({ userId, rating });
      }
    }
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
