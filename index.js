//import cors
const cors = require('cors')

//import dataservice file from service folder - to get the data
const dataservice = require('./service/dataservice')      //similarly export required data from the imported file

// importing jsonwebtoken
const jwt = require('jsonwebtoken')

//import express
const express = require('express')   // 'require' used to import and it is stored in variable named express
const{json}=require('express')

//create app
const app = express()

//connect frontend using cors 
app.use(cors({ origin: 'http://localhost:4200' }))

//to convert json data
app.use(express.json())            // use.. json method of express



//Middleware to verify token
const jwtmiddleware = (req, res, next) => {
    console.log("..........router specific middleware.........");

    try {
        const token = req.headers['access-token']
        const data = jwt.verify(token, "secretkey123")
        console.log(data);
        next() //next is called to continue with the other requests, otherwise middleware will keep running and server will be stuck in the middleware
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            stats: false,
            message: "please login"
        })
    }
}


//set port
app.listen(3000, () => {
    console.log("server started at port numbr 3000");   // to check if server started to run.. this message will appear in the terminal...
})

// our request - 
//register

app.post('/register', (req, res) => {         // data accessed using req...
    dataservice.register(req.body.acno, req.body.uname, req.body.psw).then(result => { res.status(result.statusCode).json(result) })
})



//login
app.post('/login', (req, res) => {         // data accessed using req...
    dataservice.login(req.body.acno, req.body.psw).then(result => { res.status(result.statusCode).json(result) })
    // to get the status code in the thunderclient response
})


//deposit
app.post('/deposit', jwtmiddleware, (req, res) => {         // data accessed using req...
    dataservice.deposit(req.body.acno, req.body.psw, req.body.amount).then(result => { res.status(result.statusCode).json(result) })
    // to get the status code in the thunderclient response
})


//withdraw
app.post('/withdraw', jwtmiddleware, (req, res) => {         // data accessed using req...
    dataservice.withdraw(req.body.acno, req.body.psw, req.body.amount).then(result => { res.status(result.statusCode).json(result) })
    // to get the status code in the thunderclient response
})

//transaction history
app.post('/gettransactions', jwtmiddleware, (req, res) => {         // data accessed using req...
    dataservice.gettransactions(req.body.acno).then(result => { res.status(result.statusCode).json(result) })
    // to get the status code in the thunderclient response
})

//accnt delete
app.delete('/deleteacc/:acno',jwtmiddleware,(req,res)=>{                     //acno given in params         ---- to solve delete request
    dataservice.acdelete(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})
