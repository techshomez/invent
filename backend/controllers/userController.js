const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//Register Users
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

  //Generating token
  const token = generateToken(user._id);

  //Send http-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
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
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Login Users
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter your email and password");
  }

  //checking if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please create an account");
  }

  //checking if password is correct
  const passwordCorrect = await bcrypt.compare(password, user.password);

  //Generating token
  const token = generateToken(user._id);

  //Send http-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordCorrect) {
    const { _id, fname, lname, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      fname,
      lname,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//Logout user
const logout = asyncHandler(async (req, res) => {
  //expiring cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // current date
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully logged out" });
});

//Get user data
const getUser = asyncHandler(async (req, res) => {
  res.send("all users fetched");
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
};
