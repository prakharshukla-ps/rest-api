import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/signUp", (req, res, next) =>
  userController.signUp(req, res, next)
);
userRouter.post("/signIn", (req, res) => userController.signIn(req, res));
userRouter.put("/resetPassword", jwtAuth, (req, res) =>
  userController.resetPassword(req, res)
);

export default userRouter;
