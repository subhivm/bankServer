//steps for server creation describe here   
//..............................................


//1.import  express on this folder
const express=require('express')  //import stmnt

//1.import  jsonwebtoken
const jwt=require('jsonwebtoken')  //import stmnt

//import database
const dataservice=require('./services/data.service')

//import cors
const cors=require('cors')

//2.create server app using express
const app=express()

//use cors
app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
app.use(express.json())

//4.resolving API call

//get :to read data
app.get('/',(req,res)=>{  
    res.send("GET REQUEST ")
})


//PUT :to update/modifydata
app.put('/',(req,res)=>{  
    res.send("PUT REQUEST")
})

//PATCH :to update/modifydata
app.put('/',(req,res)=>{  
    res.send("PATCH REQUEST")
})



 //PATCH :to partially update data
app.patch('/',(req,res)=>{  
    res.send("PATCH REQUEST")
})

//DELETE :to delete data
app.delete('/',(req,res)=>{  
    res.send("DELETE REQUEST")
})


//BANK SERVER

//jwtMiddleware-to verify token
const jwtMiddleware=(req,res,next)=>{
    try{
       // const token=req.body.token //fetch and store token from req body
        const token=req.headers["x-access-token"]//fetch and store token from req body
        console.log(jwt.verify(token,'keygeneratingmsg'));
        const data=jwt.verify(token,'keygeneratingmsg')
        req.currentAcno=data.currentAcno
        console.log(data.currentAcno);
        next()    //to process user req process
    }
    catch{
        res.status(401).json({
            statuscode:422,
            status:false,
            message:" please login"
        })
    }
}

//REGISTER API
app.post('/register',(req,res)=>{  
    //asynchronous canpt be loaded to a const
    dataservice.register(req.body.uname,req.body.acno,req.body.password)
    .then(result=>{  
          res.status(result.statuscode).json(result)//to change res of status=>statuscode of result
     })
   // const result=dataservice.register(req.body.uname,req.body.acno,req.body.password)
    })


   //login
app.post('/login',(req,res)=>{  
    dataservice.login(req.body.acno,req.body.pswd)
    .then(result=>{  
          res.status(result.statuscode).json(result)//to change res of status=>statuscode of result
     })

})


//deposit
app.post('/deposit',jwtMiddleware,(req,res)=>{  
    dataservice.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{  
        res.status(result.statuscode).json(result)//to change res of status=>statuscode of result
   })

})



//withdraw
app.post('/withdraw',jwtMiddleware,(req,res)=>{  
    dataservice.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{  
        res.status(result.statuscode).json(result)//to change res of status=>statuscode of result
   })

})



//transaction
app.post('/transaction',jwtMiddleware,(req,res)=>{  
    dataservice.transaction(req.body.acno)
    .then(result=>{  
        res.status(result.statuscode).json(result)//to change res of status=>statuscode of result
   })

})


//onDelete API
app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{  
    dataservice.deleteAcc(req.params.acno)
    .then(result=>{  
        res.status(result.statuscode).json(result)//to change res of status=>statuscode of result
   })

})



//3.set port no for your server page
app.listen(3000,()=>{
    console.log("server started at 3000");
})