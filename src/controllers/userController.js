import createHttpError from "http-errors";
import generateToken from "../utils/generateToken.js";
import {
  createUser,
  getAllUsers,
  findUserByEmail,
  findUserByMobile,
  validatePassword,
  deleteUserById,
  updateUserById,
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
      status: 1,
      response_code: 201,
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

    // Generate JWT token using user._id
    const token = generateToken(user._id); // Use user._id, not user.email

    return res.status(200).json({
      message: "Login successful.",
      status: 1,
      response_code: 200,
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
      status: 1,
      response_code: 200,
    });
  } catch (error) {
    return next(createHttpError(500, "Error during logout.", error));
  }
};

export const profile = (req, res, next) => {
  try {
    const userIdFromToken = req.user._id; // Authenticated user's ID from token
    const userIdFromRequest = req.params.userId; // User ID from URL parameter

    // console.log("userIdFromToken:", userIdFromToken); // Debugging
    // console.log("userIdFromRequest:", userIdFromRequest); // Debugging

    // Check if userIdFromRequest is provided
    if (!userIdFromRequest) {
      return next(createHttpError(400, "User ID is required."));
    }

    // Check if the authenticated user is trying to access their own profile
    if (userIdFromToken.toString() !== userIdFromRequest.toString()) {
      return next(
        createHttpError(403, "You are not authorized to access this profile.")
      );
    }

    const user = req.user.toObject ? req.user.toObject() : req.user; // Safe conversion
    delete user.password; // Remove the password field

    return res.status(200).json({
      status: 1,
      response_code: 200,
      user,
    });
  } catch (error) {
    return next(createHttpError(500, "Error fetching profile.", error));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userIdFromToken = req.user._id; // Authenticated user's ID from token
    const userIdFromRequest = req.params.userId || req.body.userId; // User ID from request

    // Check if the authenticated user is trying to update their own profile
    if (userIdFromToken.toString() !== userIdFromRequest.toString()) {
      return next(
        createHttpError(403, "You are not authorized to update this profile.")
      );
    }

    const updateData = req.body; // Data to update

    // Update the user profile
    const updatedUser = await updateUserById(userIdFromRequest, updateData);

    if (!updatedUser) {
      return next(createHttpError(404, "User not found."));
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      status: 1,
      response_code: 200,
      user: updatedUser,
    });
  } catch (error) {
    return next(createHttpError(500, "Error updating profile.", error));
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userIdFromToken = req.user._id; // Authenticated user's ID from token
    const userIdFromRequest = req.params.userId || req.body.userId; // User ID from request

    // Check if the authenticated user is trying to delete their own account
    if (userIdFromToken.toString() !== userIdFromRequest.toString()) {
      return next(
        createHttpError(403, "You are not authorized to delete this account.")
      );
    }

    // Delete the user account
    const deletedUser = await deleteUserById(userIdFromRequest);

    if (!deletedUser) {
      return next(createHttpError(404, "User not found."));
    }

    // Clear the token cookie (if applicable)
    res.clearCookie("token");

    return res.status(200).json({
      message: "Account deleted successfully.",
      status: 1,
      response_code: 200,
    });
  } catch (error) {
    return next(createHttpError(500, "Error deleting account.", error));
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    return res.status(200).json({
      message: "All Users detail.",
      status: 1,
      response_code: 200,
      users: allUsers,
    });
  } catch (error) {
    return next(createHttpError(500, "Error fetching users.", error));
  }
};

export const userExist = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    // Check if mobile number exists or not
    const isExistUser = await findUserByMobile(mobile);
    if (!isExistUser) {
      return res.status(200).json({
        message: "User Not Exist.",
        status: 0,
        response_code: 200,
      });
    } else {
      // Generate JWT token
      const token = generateToken(isExistUser.email);

      return res.status(200).json({
        message: "User Exist.",
        status: 1,
        response_code: 200,
        user: {
          id: isExistUser._id,
          name: isExistUser.name,
          lastName: isExistUser.lastName,
          mobile: isExistUser.mobile,
          email: isExistUser.email,
          age: isExistUser.age,
          DOB: isExistUser.DOB,
          gender: isExistUser.gender,
          pincode: isExistUser.pincode,
          city: isExistUser.city,
          state: isExistUser.state,
          familyMember: isExistUser.familyMember,
          maritalStatus: isExistUser.maritalStatus,
          education: isExistUser.education,
          occupation: isExistUser.occupation,
          isHeadOfFamily: isExistUser.isHeadOfFamily,
        },
        token,
      });
    }
  } catch (error) {
    return next(
      createHttpError(500, "Error for checking user exist or not.", error)
    );
  }
};
