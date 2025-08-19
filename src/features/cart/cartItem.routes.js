import express from "express";
import CartItemController from "./cartItem.controller.js";

const cartItemRouter = express.Router();

const cartItemController = new CartItemController();

cartItemRouter.post("/", (req, res) => cartItemController.addItem(req, res));
cartItemRouter.get("/", (req, res) =>
  cartItemController.getAllCartItems(req, res)
);
cartItemRouter.delete("/:cartItemId", (req, res) =>
  cartItemController.deleteCartItem(req, res)
);

export default cartItemRouter;
