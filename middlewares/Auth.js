const jwt = require("jsonwebtoken");

exports.changePasswordToken = async (req, res, next) => {
  const passwordToken = req.cookies.change_token;
  if (!passwordToken) {
    res.status(400).send("A token is required.");
    return;
  }
  if (
    jwt.verify(passwordToken, process.env.FORGET_PASSWORD_KEY, (err, decodeToken) => {
      if (err) {
        console.log(err);
      } else {
        req.userEmail = decodeToken.email;
        next();
      }
    })
  )
    res.status(403).send("Invalid token!");
};

exports.adminAuth = async (req, res, next) => {
  const adminToken = req.cookies.access_token;
  if (!adminToken) {
    res.status(400).send("You dont have the permissions.");
    return;
  }
  try {
    await jwt.verify(adminToken, process.env.ADMIN_KEY);
    req.adminAuth = true;
    next();
  } catch (error) {
    res.status(400).send("You dont have the permissions.");
  }
};

exports.userAuth = async (req, res, next) => {
  const viewToken = req.cookies.access_token;
  if (!viewToken) {
    res.status(400).send("Please login to continue.");
    return;
  }
  if(jwt.verify(viewToken,process.env.TOKEN_KEY)){
    next()
  }else if(jwt.verify(viewToken,process.env.ADMIN_KEY)){
    next()
  }else{
    res.status(400).send("You dont have the permissions.");
  }
}
