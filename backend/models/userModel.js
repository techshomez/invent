const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Please enter your first name"],
    },

    lname: {
      type: String,
      required: [true, "Please enter your last name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your emaill"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Password can not be less than 8 characters"],
      maxLength: [23, "Password can not be more than 23 characters"],
    },

    photo: {
      type: String,
      required: [true, "Please choose a profile picture"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },

    phone: {
      type: String,
      default: "+234",
    },

    bio: {
      type: String,
      default: "bio",
      maxLength: [250, "Bio must not be more than 250 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
