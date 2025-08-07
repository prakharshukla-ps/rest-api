import express from "express";
import fileUpload from "../../middlewares/fileUpload.middleware.js";
import ProductController from "./product.controller.js";

const productRouter = express.Router();

const productController = new ProductController();

productRouter.get("/", productController.getAllProducts);
productRouter.post(
  "/",
  fileUpload.single("imageUrl"),
  productController.addProduct
);
productRouter.post("/rate", productController.rateProduct);
productRouter.get("/filter", productController.getFilteredProducts);
productRouter.get("/:id", productController.getOneProduct);

export default productRouter;
