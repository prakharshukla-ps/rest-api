export default class CartItemModel {
  constructor(id, productId, userId, quantity) {
    this.id = id;
    this.productId = productId;
    this.userId = userId;
    this.quantity = quantity;
  }

  static addItem(productId, userId, quantity) {
    const existingCartItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.userId == userId && cartItem.productId == productId
    );

    if (existingCartItemIndex >= 0) {
      cartItems[existingCartItemIndex].quantity = quantity;
    } else {
      const cartItem = new CartItemModel(productId, userId, quantity);
      cartItem.id = cartItems.length + 1;
      cartItems.push(cartItem);
    }
  }

  static getAllCartItems(userId) {
    const allCartItems = cartItems.filter(
      (cartItem) => cartItem.userId == userId
    );

    return allCartItems;
  }

  static deleteCartItem(cartItemId, userId) {
    const cartItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id == cartItemId && cartItem.userId == userId
    );

    if (cartItemIndex == -1) {
      return "Item not found";
    } else {
      cartItems.splice(cartItemIndex, 1);
    }
  }
}

let cartItems = [
  new CartItemModel(1, 2, 2, 1),
  new CartItemModel(2, 1, 2, 3),
  new CartItemModel(3, 1, 1, 5),
];
