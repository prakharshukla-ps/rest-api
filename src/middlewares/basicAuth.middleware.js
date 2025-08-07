import UserModel from "../features/user/user.model.js";

const basicAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("No authorization details found!");
  }

  const base64Credentials = authHeader.replace("Basic ", "");

  const decodedCredentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );

  const credentials = decodedCredentials.split(":");

  const user = UserModel.getAllUsers().find(
    (user) => user.email == credentials[0] && user.password == credentials[1]
  );

  if (user) {
    next();
  } else {
    return res.status(401).send("Incorrect credentials");
  }
};

export default basicAuth;
