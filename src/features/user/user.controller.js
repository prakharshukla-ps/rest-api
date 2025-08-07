import jwt from "jsonwebtoken";
import UserModel from "./user.model.js";

export default class UserController {
  signUp(req, res) {
    const { name, email, password, type } = req.body;

    const user = UserModel.signUp(name, email, password, type);

    res.status(201).send(user);
  }

  signIn(req, res) {
    const { email, password } = req.body;

    const user = UserModel.signIn(email, password);

    if (!user) {
      return res.status(400).send("Incorrect credentials");
    } else {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "ursKawTFG8ACKtETt5IIaFh3aNCGPfkS",
        {
          expiresIn: "1h",
        }
      );

      return res.send(token);
    }
  }
}
