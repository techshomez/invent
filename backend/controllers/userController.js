const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, password } = req.body;

  // validation

  if (!fname || !lname || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required field");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password cannot be less than 8 character");
  }

  //checking if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email address has already been used");
  }

  //Creating new user
  const user = await User.create({
    fname,
    lname,
    email,
    password,
  });

  if (user) {
    const { _id, fname, lname, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      fname,
      lname,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

module.exports = {
  registerUser,
};
