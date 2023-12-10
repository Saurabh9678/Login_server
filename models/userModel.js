const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Enter your email"],
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password_1: {
    type: String,
    required: [true, "Please Enter your password"],
    select:false
  },
  password_2: {
    type: String,
    required: [true, "Please Enter your password"],
    select:false
  },
  password_3: {
    type: String,
    required: [true, "Please Enter your password"],
    select:false
  },
  password_4: {
    type: String,
    required: [true, "Please Enter your password"],
    select:false
  },
  password_5: {
    type: String,
    required: [true, "Please Enter your password"],
    select:false
  },
  mobile: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
