import express from "express";
import CartItemController from "./cartItem.controller.js";

const cartItemRouter = express.Router();

const cartItemController = new CartItemController();

cartItemRouter.post("/", cartItemController.addItem);
cartItemRouter.get("/", cartItemController.getAllCartItems);
cartItemRouter.delete("/:cartItemId", cartItemController.deleteCartItem);

export default cartItemRouter;
