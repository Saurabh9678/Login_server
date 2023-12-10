const express = require("express");

const {
  loginUser,
  registerUser,
  logoutUser,
  getUserDetail,
  getAllUsers,
  updateUserDetail,
  deleteUser,
  loginAdmin,
  changeRole,
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(isAuthenticatedUser, logoutUser);

router
  .route("/details")
  .get(isAuthenticatedUser, getUserDetail)
  .put(isAuthenticatedUser, updateUserDetail);

router.route("/cms").get(isAuthenticatedUser, getAllUsers);
router
  .route("/cms/:userId")
  .delete(isAuthenticatedUser, deleteUser)
  .put(isAuthenticatedUser, changeRole);
router.route("/cms/login").post(loginAdmin);

module.exports = router;
