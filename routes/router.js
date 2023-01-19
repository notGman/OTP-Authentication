const express = require("express");
const router = express.Router();
const {
  createNewUser,
  userLogin,
  forgetPassword,
  verifyOtp,
  changePassword,
  getAllUsers,
  adminPage,
  logout,
  protectedPage
} = require("../controllers/controller");
const { changePasswordToken, adminAuth, userAuth } = require("../middlewares/Auth");

router.get("/", getAllUsers);
router.post("/register", createNewUser);
router.post("/login", userLogin);
router.post("/forgetpassword", forgetPassword);
router.post("/forgetpassword/verify", verifyOtp);
router.post("/forgetpassword/change", changePasswordToken, changePassword);
router.post("/user/admin", adminAuth, adminPage);
router.get("/user/logout",logout)
router.get("/user/protecetdpage",userAuth,protectedPage)

module.exports = router;
