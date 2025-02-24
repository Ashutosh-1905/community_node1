import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
  const { password, ...rest } = userData;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    ...rest,
    password: hashPassword,
  });

  return user;
};

export const getAllUsers = async () => {
  const users = await User.find().select("-password").lean();
  return users;
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const findUserByMobile = async (mobile) => {
  return await User.findOne({ mobile }).select("+password");
};

export const validatePassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};