const log = require("../models/log");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");

exports.firstLog = async (ip, email, password, action) => {
  const currentDate = new Date.now();
  const logData = {
    ip_address: ip,
    timestamp: currentDate,
    tried_Ac: {
      email,
      password,
    },
    action,
  };

  try {
    await log.create(logData);
  } catch (error) {
    console.log(error);
  }
};

exports.saveLog = async (ip, action) => {
  const currentDate = new Date.now();
  const logData = {
    ip_address: ip,
    timestamp: currentDate,
    action,
  };

  try {
    await log.create(logData);
  } catch (error) {
    console.log(error);
  }
};

exports.getAllLogs = catchAsyncError(async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    return next(new ErrorHandler("Not authorized", 401));
  }
  const logs = await log.find();
  return res.status(200).json({
    success: true,
    data: logs,
    message: "All logs retrieved",
    error: "",
  });
});
