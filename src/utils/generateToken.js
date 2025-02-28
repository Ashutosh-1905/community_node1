import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: "7d",
    });
  } catch (error) {
    throw new Error("Error while generating token.");
  }
};

export default generateToken;