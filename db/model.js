const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'User name is required.'],
    trim:true
  },
  email:{
    type:String,
    required:[true,'Email is required.'],
  },
  password:{
    type:String,
    required:[true,'A password is required.']
  },
  role:{
    type:String,
    enum:["ADMIN","USER"],
    default:"USER"
  },
  emailOtp: String
})

module.exports = mongoose.model("User",userSchema)