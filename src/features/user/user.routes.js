import express from "express";
import UserController from "./user.controller.js";

const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/signUp", (req, res) => userController.signUp(req, res));
userRouter.post("/signIn", (req, res) => userController.signIn(req, res));

export default userRouter;
