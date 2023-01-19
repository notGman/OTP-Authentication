const nodemailer = require("nodemailer");

exports.otpGen = () => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

exports.sendOtp = async(email, otp) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:process.env.ADMIN_EMAIL,
      pass:process.env.ADMIN_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "OTP REQUEST FROM THE BACKEND SERVER",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
