const mongoose = require('mongoose')

exports.connect = () =>{
  mongoose.set('strictQuery',false)
  mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>console.log("DB connected!"))
  .catch(err=>console.log(err))
}