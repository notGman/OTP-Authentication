const jwt = require('jsonwebtoken')

exports.createToken = (payload) =>{
  return jwt.sign(payload,process.env.TOKEN_KEY,{expiresIn:'12h'})
}

exports.passwordToken = (payload) =>{
  return jwt.sign(payload,process.env.FORGET_PASSWORD_KEY,{expiresIn:'10m'})
}

exports.createAdminToken = (payload) =>{
  return jwt.sign(payload,process.env.ADMIN_KEY,{expiresIn:'12h'})
}