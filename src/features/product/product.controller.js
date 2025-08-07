import ProductModel from "./product.model.js";

export default class ProductController {
  getAllProducts(req, res) {
    const products = ProductModel.getAllProducts();
    res.status(200).send(products);
  }

  addProduct(req, res) {
    const { name, desc, category, price, sizes } = req.body;

    const newProduct = {
      name,
      desc,
      imageUrl: req.file.filename,
      category,
      price: Number(price),
      sizes: sizes.split(","),
    };

    const createdProduct = ProductModel.addProduct(newProduct);

    res.status(201).send(createdProduct);
  }

  rateProduct(req, res) {
    const { userId, productId, rating } = req.query;

    ProductModel.rateProduct(userId, productId, rating);

    return res.status(200).send("Rating updated");
  }

  getOneProduct(req, res) {
    const productId = req.params.id;

    const product = ProductModel.getSingleProduct(productId);

    if (!product) {
      res.status(404).send("Product not found");
    } else {
      return res.status(200).send(product);
    }
  }

  getFilteredProducts(req, res) {
    const { minPrice, maxPrice, category } = req.query;

    const filteredProducts = ProductModel.filterProducts(
      minPrice,
      maxPrice,
      category
    );

    res.status(200).send(filteredProducts);
  }
}
