export default class UserModel {
  constructor(name, email, password, type) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  static getAllUsers() {
    return users;
  }
}

let users = [
  {
    id: 1,
    name: "Seller User",
    email: "seller@gmail.com",
    password: "Password",
    type: "seller",
  },
  {
    id: 2,
    name: "Customer User",
    email: "customer@gmail.com",
    password: "Password",
    type: "customer",
  },
];
