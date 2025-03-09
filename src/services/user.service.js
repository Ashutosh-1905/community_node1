import User from "../models/userModel.js";

export const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

export const getAllUsers = async () => {
  const users = await User.find().lean();
  return users;
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserByMobile = async (mobile) => {
  return await User.findOne({ mobile });
};
