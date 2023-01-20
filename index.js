
//import dataservice file from service folder - to get the data
const dataservice = require('./service/dataservice')      //similarly export required data from the imported file

// importing jsonwebtoken
const jwt = require('jsonwebtoken')

//import express
const express = require('express')   // 'require' used to import and it is stored in variable named express

//create app
const app = express()


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
    catch{
        res.status(422).json({statusCode:422,
        stats:false,
        message:"please login"})
    }
}

//request

//GET Request - to access data
// app.get('/',(req,res)=>{
//     res.send('GET Method checking...........')
// })
//         //in the browser only get data will be displayed......... 
//         //other request can be checked by simply copy the link and paste in thunderclient


// //post request - store
// app.post('/',(req,res)=>{
//     res.send('post Method checking...........')
// })

// //put request - complete edit
// app.put('/',(req,res)=>{
//     res.send('put Method checking...........')
// })

// //patch request - partial edit
// app.patch('/',(req,res)=>{
//     res.send('patch Method checking...........')
// })

// //delete request - delete
// app.delete('/',(req,res)=>{  
//     res.send('delete Method checking...........')
// }) 

//set port
app.listen(3000, () => {
    console.log("server started at port numbr 3000");   // to check if server started to run.. this message will appear in the terminal...
})

// our request - 
//register

app.post('/register', (req, res) => {         // data accessed using req...
    const result = dataservice.register(req.body.acno, req.body.uname, req.body.psw)
    // res.send(result)
    // res.json(result)   //instead of send use json () - data will be converted to json .. for frontend technology convertion

    res.status(result.statusCode).json(result)  // to get the status code in the thunderclient response


    // if (result) {
    //     res.send('registration success')
    // }
    // else {
    //     res.send('user already exist')
    // }

    // console.log(req.body);         //this is undefined shown in the port running terminal.......as the data will be in json format......change it to js
})



//login
app.post('/login', (req, res) => {         // data accessed using req...
    const result = dataservice.login(req.body.acno, req.body.psw)
    res.status(result.statusCode).json(result)  // to get the status code in the thunderclient response
})


//deposit
app.post('/deposit', jwtmiddleware, (req, res) => {         // data accessed using req...
    const result = dataservice.deposit(req.body.acno, req.body.psw, req.body.amount)
    res.status(result.statusCode).json(result)  // to get the status code in the thunderclient response
})


//withdraw
app.post('/withdraw', jwtmiddleware, (req, res) => {         // data accessed using req...
    const result = dataservice.withdraw(req.body.acno, req.body.psw, req.body.amount)
    res.status(result.statusCode).json(result)  // to get the status code in the thunderclient response
})

//transaction history
app.post('/gettransactions', jwtmiddleware,(req, res) => {         // data accessed using req...
    const result = dataservice.gettransactions(req.body.acno)
    res.status(result.statusCode).json(result)  // to get the status code in the thunderclient response
})

//accnt delete