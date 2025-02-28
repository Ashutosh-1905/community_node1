import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

// User Register Route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address."),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters."),
  ],
  userController.register
);

// User Login Route
router.post(
  "/login",
  [
    body("email").optional().isEmail().withMessage("Invalid email address."),
    body("mobile")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid mobile number."),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters."),
  ],
  userController.login
);

// User Logout Route
router.get("/logout", authUser, userController.logout);

// User Exists Route
router.post("/user_exist", userController.userExist);

// All Users Route
router.get("/all", authUser, userController.getAllUsersController);

// User Profile Route
router.get("/profile/:userId", authUser, userController.profile);

// Update Profile Route
router.put("/profile/:userId", authUser, userController.updateProfile);

// Delete Account Route
router.delete("/account/:userId", authUser, userController.deleteAccount);

export default router;
