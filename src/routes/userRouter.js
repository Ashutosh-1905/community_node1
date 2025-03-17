import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/register",
  [body("email").isEmail().withMessage("Invalid email address.")],
  userController.register
);

router.post(
  "/login",
  [
    body("email").optional().isEmail().withMessage("Invalid email address."),
    body("mobile")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid mobile number."),
  ],
  userController.login
);

router.post("/user_exist", userController.userExist);
router.get("/logout", authUser, userController.logout);
router.get("/profile", authUser, userController.profile);
router.get("/all", authUser, userController.getAllUsersController);

export default router;
