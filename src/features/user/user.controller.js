import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res) {
    const { name, email, password, type } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new UserModel(name, email, hashedPassword, type);

    await this.userRepository.signUp(user);

    res.status(201).send(user);
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return res.status(400).send("Incorrect credentials");
      } else {
        const result = await bcrypt.compare(password, user.password);

        if (result) {
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );

          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect credentials");
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }
}
