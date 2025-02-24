import createHttpError from "http-errors";
import generateToken from "../utils/generateToken.js";
import {
  createUser,
  getAllUsers,
  findUserByEmail,
  findUserByMobile,
  validatePassword,
} from "../services/user.service.js";

export const register = async (req, res, next) => {
  try {
    const {
      name,
      lastName,
      mobile,
      email,
      password,
      age,
      DOB,
      gender,
      pincode,
      city,
      state,
      familyMember,
      maritalStatus,
      education,
      occupation,
      isHeadOfFamily,
    } = req.body;

    // Check if mobile number is already registered
    const isRegisterUser = await findUserByMobile(mobile);
    if (isRegisterUser) {
      return next(
        createHttpError(400, "This mobile number is already registered.")
      );
    }

    // Check if email is already registered
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return next(createHttpError(400, "This email is already registered."));
    }

    // Create a new user
    const user = await createUser({
      name,
      lastName,
      mobile,
      email,
      password,
      age,
      DOB,
      gender,
      pincode,
      city,
      state,
      familyMember,
      maritalStatus,
      education,
      occupation,
      isHeadOfFamily,
    });

    // Generate JWT token
    const token = generateToken(user.email);

    return res.status(201).json({
      message: "User registered successfully.",
      success: true,
      user,
      token,
    });
  } catch (error) {
    return next(
      createHttpError(500, "Error while registering new user.", error)
    );
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, mobile, password } = req.body;

    // Check if either email or mobile is provided
    if (!email && !mobile) {
      return next(createHttpError(400, "Email or mobile number is required."));
    }

    let user;

    // Find user by email or mobile
    if (email) {
      user = await findUserByEmail(email);
    } else if (mobile) {
      user = await findUserByMobile(mobile);
    }

    // Check if user exists
    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    // Validate password
    const isPasswordValid = await validatePassword(user, password);
    if (!isPasswordValid) {
      return next(createHttpError(400, "Invalid password."));
    }

    // Generate JWT token
    const token = generateToken(user.email);

    return res.status(200).json({
      message: "Login successful.",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    return next(createHttpError(500, "Error during login.", error));
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successful.",
      success: true,
    });
  } catch (error) {
    return next(createHttpError(500, "Error during logout.", error));
  }
};

export const profile = (req, res, next) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return next(createHttpError(500, "Error fetching profile.", error));
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    return res.status(200).json({ users: allUsers });
  } catch (error) {
    return next(createHttpError(500, "Error fetching users.", error));
  }
};
