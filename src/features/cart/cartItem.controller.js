import CartItemModel from "./cartItem.model.js";

export default class CartItemController {
  addItem(req, res) {
    const { productId, quantity } = req.query;
    const { userId } = req;

    CartItemModel.addItem(productId, userId, quantity);

    res.status(200).send("Cart item updated");
  }

  getAllCartItems(req, res) {
    const { userId } = req;

    const allCartItems = CartItemModel.getAllCartItems(userId);

    res.status(200).send(allCartItems);
  }

  deleteCartItem(req, res) {
    const { cartItemId } = req.params;
    const { userId } = req;

    const error = CartItemModel.deleteCartItem(cartItemId, userId);

    if (error) {
      return res.status(400).send(error);
    } else {
      return res.status(200).send("Cart item deleted");
    }
  }
}
