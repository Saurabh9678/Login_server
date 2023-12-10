// Create Token and saving in cookie
const jwt = require("jsonwebtoken");
const sendToken = (user, statusCode, res, flag) => {
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
      flag: flag,
    });
  } else if (flag == 1) {
    const token = jwt.sign({ id: "6575a91291bca0e41c089245" }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      token,
      flag: flag,
    });
  }
};

module.exports = sendToken;
