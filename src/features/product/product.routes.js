import express from "express";
import fileUpload from "../../middlewares/fileUpload.middleware.js";
import ProductController from "./product.controller.js";

const productRouter = express.Router();

const productController = new ProductController();

productRouter.get("/", (req, res) =>
  productController.getAllProducts(req, res)
);
productRouter.post("/", fileUpload.single("imageUrl"), (req, res) =>
  productController.addProduct(req, res)
);
productRouter.post("/rate", (req, res, next) =>
  productController.rateProduct(req, res, next)
);
productRouter.get("/filter", (req, res) =>
  productController.getFilteredProducts(req, res)
);
productRouter.get("/:id", (req, res) =>
  productController.getOneProduct(req, res)
);

export default productRouter;
