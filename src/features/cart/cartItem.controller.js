import CartItemRepository from "./cartItem.repository.js";

export default class CartItemController {
  constructor() {
    this.cartItemRepository = new CartItemRepository();
  }

  async addItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      const { userId } = req;

      await this.cartItemRepository.addItem(productId, userId, quantity);

      res.status(201).send("Cart updated successfully");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async getAllCartItems(req, res) {
    try {
      const { userId } = req;

      const allCartItems = await this.cartItemRepository.getAllCartItems(
        userId
      );

      res.status(200).send(allCartItems);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async deleteCartItem(req, res) {
    const { cartItemId } = req.params;
    const { userId } = req;

    const isDeleted = await this.cartItemRepository.deleteCartItem(
      cartItemId,
      userId
    );

    if (!isDeleted) {
      return res.status(400).send(error);
    } else {
      return res.status(200).send("Cart item deleted");
    }
  }
}
