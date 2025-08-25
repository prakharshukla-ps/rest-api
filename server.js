import "./env.js";

import cors from "cors";
import express from "express";

// import { connectToMongoDB } from "./src/config/mongodb.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import ApplicationError from "./src/error-handler/applicationError.js";
import cartItemRouter from "./src/features/cart/cartItem.routes.js";
import orderRouter from "./src/features/order/order.routes.js";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
import loggerWinstonMiddleware from "./src/middlewares/logger-winston.middleware.js";
import mongoose from "mongoose";
// import apiDocs from "./swagger.json" with { type: "json" };

const server = express();

server.use(express.json());

// server.use((req, res, next) => {
//   // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Origin", "*");
//   // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");

//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

const corsOptions = { origin: "http://localhost:3000" };

server.use(cors(corsOptions));

server.use(loggerWinstonMiddleware);

// server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/cartItems", jwtAuth, cartItemRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send("Welcome to rest api");
});

server.use((err, req, res, next) => {
  console.log(err);

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }

  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  res.status(500).send("Something went wrong");
});

server.use((req, res) =>
  res
    .status(404)
    .send(
      "API not found. Please check our documentation for more information at localhost:3000/api-docs"
    )
);

server.listen(3000, () => {
  console.log("Server is listening at port 3000");
  // connectToMongoDB();
  connectUsingMongoose();
});
