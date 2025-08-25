import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    const { name, email, password, type } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      // const user = new UserModel(name, email, hashedPassword, type);
      const user = {
        name,
        email,
        password: hashedPassword,
        type,
      };

      await this.userRepository.signUp(user);

      res.status(201).send(user);
    } catch (error) {
      next(error);
      // return res.status(400).send("Something went wrong");
    }
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

  async getAllUsers(req, res) {
    try {
      const users = await this.userRepository.getAllUsers();
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async resetPassword(req, res) {
    const { newPassword } = req.body;
    const { userId } = req;

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    try {
      await this.userRepository.resetPassword(userId, hashedPassword);
      res.status(200).send("Password is reset");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }
}
