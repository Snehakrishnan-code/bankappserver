//import db.js
const db = require("./db")

// importing jsonwebtoken
const jwt = require('jsonwebtoken')

// this is js.. not ts.. so need not specify the datatype
// register

register = (acno, uname, psw) => {

  return db.User.findOne({ acno }).then(user => {
    if (user) {                                //if no content in the user
      return {
        statusCode: 401,
        status: false,
        message: "user already exist"         //this format should be followed.. this statuscode, status and message is important for angular to understand
      }
    }
    else {
      const newuser = new db.User({
        acno,              //this is new object of class User
        username: uname,
        password: psw,
        balance: 0,
        transaction: []
      })

      //data would be added but the object would not be saved in database.. you will have to call save()
      newuser.save()
      return {
        statusCode: 200,
        status: true,
        message: "registration successful"
      }
    }
  })
}



//login
login = (acno, psw) => {

  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      //token generation
      const token = jwt.sign({ currentacno: acno }, 'secretkey123')  // token generated
      return {
        statusCode: 200,
        status: true,
        message: "login successful",
        currentacno: acno,
        currentuser: user.username,
        token
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "incorrect acno or password"
      }
    }
  })
}




// //deposite
deposit = (acno, password, amount) => {
  var amnt = parseInt(amount)    // amount is string value, it will be changed to integer value

  return db.User.findOne({ acno, password }).then(user => {

    if (user) {
      user.balance += amnt            // add deposited amount into the balance
      user.transaction.push({ type: 'CREDIT', amount: amnt })
      user.save()
      return {
        statusCode: 200,
        status: true,
        message: `${user.balance}`
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "Incorrect acno or password"
      }
    }
  })
}

withdraw = (acno, password, amount) => {
  var amnt = parseInt(amount)    // amount is string value, it will be changed to integer value
  return db.User.findOne({ acno, password }).then(user => {

    if (user) {
      if (amnt > user.balance) {
        return {
          statusCode: 401,
          status: false,
          message: "insufficient balance"
        }
      }
      else{
        user.balance = user.balance - amnt
        user.transaction.push({ type: 'DEBIT', amount: amnt })
        user.save()
      return {
          statusCode: 200,
          status: true,
          message: `${user.balance}`
        }
      }
    }
    else{
      return {
        statusCode: 401,
        status: false,
        message: "incorrect userdetails"
      }
    }
  })
}



gettransactions = (acno) => {
  return db.User.findOne({ acno }).then(user=>{
    if (user) {
      return {
        statusCode: 200,
        status: true,
        message: user.transaction
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "incorrect acno"
      }
    }
  })
}

acdelete=(acno)=>{
  return db.User.deleteOne({acno}).then(user=>{              //deleteOne for deletion
    if(user){
      return{
        statusCode: 200,
        status: true,
        message: "ac deleted"
      }
    }
    else{
      return {
        statusCode: 401,
        status: false,
        message: "incorrect acno"
      }
    }
  })
}


module.exports = {
  register,
  login,
  deposit,
  withdraw,
  gettransactions,
  acdelete
}
// functions of one file and folder can be imported to the required file...
// similarly export required data from the imported file
// export file - module.exports={}
// export folder - package.exports{}