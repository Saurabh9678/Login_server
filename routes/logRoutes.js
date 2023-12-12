const express = require("express");
const { getAllLogs } = require("../controllers/log");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(isAuthenticatedUser, getAllLogs);

module.exports = router;
