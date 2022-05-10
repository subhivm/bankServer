//database connection

//import mongoose
const mongoose=require('mongoose')

//connection string to connect db with server
mongoose.connect('mongodb://localhost:27017/bankServer',{
    useNewUrlParser:true  //to avoid certain warning
})

//create a model inorder :to perform the oprations b/w server and mongodb
  const User= mongoose.model('User',{
    acno:Number,
    uname:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}

