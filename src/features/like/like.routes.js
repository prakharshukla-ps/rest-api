import express from "express";
import LikeController from "./like.controller.js";

const likeRouter = express.Router();

const likeController = new LikeController();

likeRouter.post("/", (req, res) => likeController.likeItem(req, res));
likeRouter.get("/", (req, res) => likeController.getLikes(req, res));

export default likeRouter;
