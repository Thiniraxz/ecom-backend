const User = require("../models/userModel");

exports.createUser = async (data) => {
  const newuser = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  });
  return newuser;
};

exports.findOneWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

exports.findById = async (id) => {
  return await User.findById(id);
};

exports.findOne = async (refresh_token) => {
  return await User.findOne({ refresh_token });
};
