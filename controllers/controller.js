const User = require("../db/model");
const tokenGen = require("../tokens/jwt");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const otpToken = require("../tokens/otp");

exports.getAllUsers = async (req, res) => {
  const users = await User.find({}).select("name email");
  res.status(200).json(users);
};

exports.createNewUser = async (req, res) => {
  const { name, email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    res.status(400).send("User already exists. Please login!");
    return;
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const createUser = new User({
    name,
    email: email.toLowerCase(),
    password: encryptedPassword,
    role: email.toLowerCase() === process.env.ADMIN_EMAIL ? "ADMIN" : "USER",
  });
  const user = await createUser.save();

  let token;
  if (email.toLowerCase() === process.env.ADMIN_EMAIL) {
    token = tokenGen.createAdminToken({ user_id: user._id, email });
  } else {
    token = tokenGen.createToken({ user_id: user._id, email });
  }

  res.cookie("access_token", token, { httpOnly: true }).status(200).json(user);
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(400).send("Invalid credintals!");
    return;
  }

  if (await bcrypt.compare(password, user.password)) {
    let token;
    if (user.role == "ADMIN") {
      token = tokenGen.createAdminToken({ user_id: user._id, email });
    } else {
      token = tokenGen.createToken({ user_id: user._id, email });
    }
    res.cookie("access_token", token, { httpOnly: true }).status(200).send("Login successful!");
    return;
  }
  res.status(400).send("Invalid credintals!");
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send("User unavailable. Please register!");
    return;
  }

  const otp = otpToken.otpGen();
  user.emailOtp = otp;
  user.save();
  await otpToken.sendOtp(email, otp);
  res.status(201).send("OTP sent to email");
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send("User unavailable. Please register!");
    return;
  }

  if (user && otp == user.emailOtp) {
    const token = tokenGen.passwordToken({ user_id: user._id, email });
    res.cookie("change_token", token, { httpOnly: true }).status(200).send("Proceed to change password");
    return;
  }
  res.status(403).send("Invalid OTP!");
};

exports.changePassword = async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;
  const email = req.userEmail;
  if (newPassword !== confirmNewPassword) {
    res.status(400).send("Password do not match! Try again");
    return;
  } else {
    const user = await User.findOne({ email });
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { $set: { password: encryptedPassword } });
    res.clearCookie("change_token").status(200).send("Password changed!");
  }
};

exports.adminPage = async (req, res) => {
  if (req.adminAuth) {
    const { name, email, role } = req.body;
    if (email == process.env.ADMIN_EMAIL) {
      res.status(400).send("You dont have the permissions.");
      return;
    }
    await User.updateOne({ email }, { $set: { name, role } })
      .then(() => res.status(200).send("User updated!"))
      .catch((err) => console.log(err));
  }
};

exports.protectedPage = async (req, res) => {
  res.status(200).send("Welcome to the protected page");
};

exports.logout = async (req, res) => {
  res.clearCookie("access_token").status(200).send("Logout successful!");
};
