const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, mobile } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const nameLength = name.length;
  const dummy_1 = await bcrypt.hash(`${mobile}@${name}`, salt);
  const dummy_2 = await bcrypt.hash(`${name}@${mobile}`, salt);
  const dummy_3 = await bcrypt.hash(
    `${name.substring(0, nameLength - 2)}#${mobile}`,
    salt
  );
  const dummy_4 = await bcrypt.hash(`${name}#${mobile.substring(0, 4)}`, salt);

  const user = await User.create({
    name,
    email,
    password_1: hashedPassword,
    password_2: dummy_1,
    password_3: dummy_2,
    password_4: dummy_3,
    password_5: dummy_4,
    mobile,
  });

  sendToken(user, 201, res, 0);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select(
    "+password_1 +password_2 +password_3 +password_4 +password_5"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password_1);

  if (isPasswordMatched) {
    return sendToken(user, 200, res, 0);
  }

  for (let i = 2; i <= 5; i++) {
    const dummyPasswordMatch = await bcrypt.compare(
      password,
      user[`password_${i}`]
    );
    if (dummyPasswordMatch) {
      return sendToken({}, 200, res, 1);
    }
  }

  return next(new ErrorHandler("Invalid email or password", 401));
});

// Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
    error: "",
  });
});

//Get user Detail --Profile
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
    message: "Success",
    error: "",
  });
});

//update profile
exports.updateUserDetail = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { name, mobile } = req.body;

  user.name = name;
  user.mobile = mobile;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
    message: "Success",
    error: "",
  });
});

//Login --CMS
exports.loginAdmin = catchAsyncError(async (req, res, next) => {
  const dummyPasswords = [
    "password123",
    "admin123",
    "qwerty",
    "123456",
    "letmein",
    "123abc",
    "welcome",
    "login",
    "monkey",
    "1234",
    "password1",
    "abc123",
    "111111",
    "12345",
    "123123",
    "sunshine",
    "123456789",
    "password!",
    "superman",
    "iloveyou",
    "football",
    "baseball",
    "123qwe",
    "master",
    "1234abcd",
    "trustno1",
    "welcome1",
    "qwerty123",
    "letmein1",
    "password123!",
    "passw0rd",
    "hello123",
    "welcome123",
    "abc123!",
    "adminadmin",
    "test123",
    "password01",
    "admin1",
    "qwerty1",
    "pass123",
    "password12",
    "123qwe!@#",
    "1234qwer",
    "testtest",
    "adminadmin1",
    "password1234",
    "qwerty12345",
    "abcdef123",
  ];
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
  if (dummyPasswords.includes(password)) {
    return sendToken({}, 200, res, 1);
  }
  const user = await User.findOne({ email }).select(
    "+password_1 +password_2 +password_3 +password_4 +password_5"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  if (user.role !== "admin") {
    return next(new ErrorHandler("Not authorized", 401));
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password_1);

  if (isPasswordMatched) {
    return sendToken(user, 200, res, 0);
  }

  for (let i = 2; i <= 5; i++) {
    const dummyPasswordMatch = await bcrypt.compare(
      password,
      user[`password_${i}`]
    );
    if (dummyPasswordMatch) {
      return sendToken({}, 200, res, 1);
    }
  }

  return next(new ErrorHandler("Invalid email or password", 401));
});
//Get all users --CMS
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    return next(new ErrorHandler("Not authorized", 401));
  }
  const users = await User.find();
  return res.status(200).json({
    success: true,
    message: "All users",
    data: users,
    error: "",
  });
});

//delete user  --CMS
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;
  if (user.role !== "admin") {
    return next(new ErrorHandler("Not authorized", 401));
  }
  await User.findByIdAndDelete(userId);

  return res.status(200).json({
    success: true,
    message: "User deleted",
    error: "",
  });
});

//Assign role
exports.changeRole = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    return next(new ErrorHandler("Not authorized", 401));
  }
  const { userId } = req.params;
  const targetUser = await User.findById(userId);

  if (targetUser.role === "user") {
    targetUser.role = "admin";
  } else {
    targetUser.role = "user";
  }

  await targetUser.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Role changed",
    data: {
      name: targetUser.name,
      role: targetUser.role,
    },
  });
});
