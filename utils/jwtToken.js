// Create Token and saving in cookie
const dummyUserSchema = require("../models/dummyUser");
const jwt = require("jsonwebtoken");
const sendToken = async (user, statusCode, res, flag) => {
  if (flag == 0) {
    const token = user.getJWTToken();

    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    return res.status(statusCode).cookie("token", token, options).json({
      success: true,
      token,
      role: user.role,
      flag: flag,
    });
  } else if (flag == 1) {
    const dummyUser = await dummyUserSchema.find();
    const randomDummyUserId =
      dummyUser[Math.floor(Math.random() * dummyUser.length)]._id;
    const token = jwt.sign({ id: randomDummyUserId }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      token,
      role: user.role,
      flag: flag,
    });
  }
};

module.exports = sendToken;
