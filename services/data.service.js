  //import jsonwebtoken 
const jwt=require('jsonwebtoken')
//const { User } = require('./db')

//import db
const db=require('./db')

  
  //database
  database={
    1000:{acno:1000,uname:"ram",password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,uname:"raj",password:1001,balance:6000,transaction:[]},
    1002:{acno:1002,uname:"rav",password:1002,balance:5500,transaction:[]}
   }


     //Register component will give unmae,acno,password
    
     const register=(uname, acno, password)=> {
     //async event solving 
     return db.User.findOne({acno})
      .then(User=>{
         console.log(User)
      if(User){
      return {
        statuscode:401,
        status:false,
        message:"acno already exist"

           }
       }
        else{
        const newUser= new db.User({
          acno,
          uname,
          password,
          balance:0,
          transaction:[]
   
        })
        newUser.save()
        return {
          statuscode:200,
          status:true,
          message:"succesfully registerd,please login"
    
            }
        }  
     })
    
  }
    // else{
    //  database[acno]={
    //    acno,
    //    uname,
    //    password,
    //    balance:0,
    //    transaction:[]

    //  }
    //  console.log(database);
    //  return {
    //   statuscode:200,
    //   status:true,
    //   message:"succesfully registerd,please login"

    // }

    // }
  

      
    
    //login
    const login=(acno,pswd)=>{
      return db.User.findOne({acno,password:pswd})
      .then(user=>{
        if(user){
          currentUser=user.uname //to get username to loginpage
          currentAcno=acno
          console.log( currentAcno + " currentAcno in login");
          const token=jwt.sign({ //token genern using sign()method
            currentAcno:acno
          },'keygeneratingmsg') //keygeneratingmsg helps to generate secrete key
          return {
            statuscode:200,
            status:true,
            message:" login succesful ",
            token,
            currentUser,
            currentAcno
          }
        }
        else{
          return {
            statuscode:422,
            status:false,
            message:"invalid credentials"
    
          }
  
        }
      })
    }


//deposit logic defined here
const deposit=(acno,pswd,amt)=>{
  var  amount=parseInt(amt)
  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    console.log(user);
    if(user){
        user.balance+=amount
        user.transaction.push(
          {
           type:"credit",
           amount:amount
          }
        )
        user.save()
               return {
          statuscode:200,
          status:true,
          message:amount+"succesfully deposited.. and new balance is :"+  user.balance
  
        }

      }
      else{
        return {
          statuscode:401,
          status:false,
          message:"invalid credentials"
  
        }

      }
   }
  )}
 
 
  
  //withdraw logic defined here
const withdraw=(req,acno,pswd,amt)=>{
  var  amount=parseInt(amt)
  console.log(acno + "acno in withdraw");

  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if(req.currentAcno!=acno){
      console.log(req.currentAcno +"currentAcno in withdraw");
      return {
        statuscode:422,
        status:false,
        message:"operation denied!!!"
      }
    }

 if(user){
  if (user.balance>amount){
    user.balance-=amount
    user.transaction.push(
      {
       type:"debit",
       amount:amount
      }
    )
//console.log(database);
user.save()
    return {
      statuscode:200,
      status:true,
      message:amount+"succesfully debited.. and new balance is :"+  user.balance

    }

  }


        else{
          return {
            statuscode:401,
            status:false,
            message:"Insufficient balance!!!"
          }
        }
  }
      else {
        return {
          statuscode:401,
          status:false,
          message:"Invalid credentials!!!!"
        }
      }
  })
}
 
 
 
 
   //transaction
 const transaction=(acno)=>{
  return db.User.findOne({acno})
  .then(user=>{
    if(user){

     return{
      statuscode:200,
      status:true,
      transaction:user.transaction
     }
   }
   else{
    return {
      statuscode:401,
      status:false,
      message:"User does not exist !!!!"

     }
    }
 }
  )}

  
  
  //deleteAcc
  const deleteAcc=(acno)=>{
    return db.User.deleteOne({acno})
    .then(user=>{
      if(!user){
        return {
          statuscode:401,
          status:false,
          message:"User does not exist !!!!"
    
         }
    
      }
      else{
        return{
          statuscode:200,
          status:true,
          message:"Account number"+acno+"deleted successfully..."
         }
    
      }
    })
  }

 
 

    //export ie,to access in other files
    module.exports={
        register,
        login,
        deposit,
        withdraw,
        transaction,
        deleteAcc
    }
 

