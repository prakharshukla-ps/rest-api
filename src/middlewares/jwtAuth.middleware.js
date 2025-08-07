import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Unauthorized access");
  }

  try {
    const payload = jwt.verify(token, "ursKawTFG8ACKtETt5IIaFh3aNCGPfkS");
    req.userId = payload.userId;
  } catch (error) {
    return res.status(401).send("Unauthorized access");
  }

  next();
};

export default jwtAuth;
