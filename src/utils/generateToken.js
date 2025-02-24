import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateToken = (email) => {
  try {
    const token = jwt.sign({ email }, config.jwtSecret, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    throw new Error("Error while generating token.");
  }
};

export default generateToken;