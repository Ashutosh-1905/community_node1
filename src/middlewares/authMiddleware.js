import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import config from "../config/config.js";
import User from "../models/userModel.js"; // Import the User model

export const authUser = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    // console.log("Authorization Header:", authHeader); // Debugging

    // Check if the Authorization header is present and starts with "Bearer"
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];

      // console.log("Token:", token); // Debugging

      // Check if the token is provided
      if (!token) {
        return next(createHttpError(401, "Access Denied. No token provided."));
      }

      // Verify the token
      const decoded = jwt.verify(token, config.jwtSecret);

      // console.log("Decoded Token:", decoded); // Debugging

      // Fetch the user from the database using the ID from the decoded token
      const user = await User.findById(decoded.id).select("-password"); // Exclude the password field

      // console.log("User fetched from DB:", user); // Debugging

      // Check if the user exists
      if (!user) {
        return next(createHttpError(404, "User not found."));
      }

      // Attach the user object to the request
      req.user = user;
      next();
    } else {
      return next(
        createHttpError(401, "Authorization header missing or invalid.")
      );
    }
  } catch (error) {
    // console.error("Token Verification Error:", error); // Debugging
    return next(createHttpError(401, "Invalid or Expired Token."));
  }
};
