import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAllProducts();
      res.status(200).send(products);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, desc, category, price, sizes } = req.body;

      const newProduct = new ProductModel(
        name,
        desc,
        req.file.filename,
        category,
        Number(price),
        sizes.split(",")
      );

      await this.productRepository.addProduct(newProduct);

      res.status(201).send(newProduct);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async rateProduct(req, res, next) {
    try {
      const { userId } = req;
      const { productId, rating } = req.body;

      await this.productRepository.rateProduct(userId, productId, rating);

      return res.status(200).send("Rating updated");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async getOneProduct(req, res) {
    try {
      const productId = req.params.id;

      const product = await this.productRepository.getSingleProduct(productId);

      if (!product) {
        res.status(404).send("Product not found");
      } else {
        return res.status(200).send(product);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async getFilteredProducts(req, res) {
    try {
      const { minPrice, maxPrice, category } = req.query;

      const filteredProducts = await this.productRepository.filterProducts(
        minPrice,
        maxPrice,
        category
      );

      res.status(200).send(filteredProducts);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async averagePrice(req, res) {
    try {
      const avg = await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(avg);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }
}
