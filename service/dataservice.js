// importing jsonwebtoken
const jwt=require('jsonwebtoken')

//this is js.. not ts.. so need not specify the datatype

userDetails = {
  1000: { acno: 1000, username: "anu", password: 123, balance: 0, transaction: [] },
  1001: { acno: 1001, username: "amal", password: 123, balance: 0, transaction: [] },
  1002: { acno: 1002, username: "arun", password: 123, balance: 0, transaction: [] },
  1003: { acno: 1003, username: "mega", password: 123, balance: 0, transaction: [] },
}

//register

register = (acno, uname, psw) => {
  if (acno in userDetails) {
    return {
      statusCode: 401,
      status: false,
      message: "user already exist"         //this format should be followed.. this statuscode, status and message is important for angular to understand
    }
  }
  else {

    userDetails[acno] = { acno, username: uname, password: psw, balance: 0, transaction: [] }
    console.log(userDetails);
    return {
      statusCode: 200,
      status: true,
      message: "registration successful"
    }
  }
}



//login
login = (acno, psw) => {

  if (acno in userDetails) {
    if (psw == userDetails[acno]["password"]) {

      // token generation
      const token=jwt.sign({currentAcno:acno},'secretkey123')  // token generated
      return {
        statusCode: 200,
        status: true,
        message: "login successful",
        token
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "incorrect password"
      }
    }
  }
  else {
    return {
      statusCode: 401,
      status: false,
      message: "incorrect userdetails"
    }
  }
}


// //deposite
deposit = (acno, password, amount) => {
  var amnt = parseInt(amount)    // amount is string value, it will be changed to integer value

  if (acno in userDetails) {     // check acno number in database
    if (password == userDetails[acno]["password"]) {  // check password
      userDetails[acno]["balance"] += amnt            // add deposited amount into the balance
      userDetails[acno]['transaction'].push({ type: 'CREDIT', amount: amnt })
      return {
        statusCode: 200,
        status: true,
        message: userDetails[acno]["balance"]
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "Incorrect password"
      }
    }

  }
  else {
    return {
      statusCode: 401,
      status: false,
      message: "incorrect userdetails"
    }
  }
}

withdraw = (acno, password, amount) => {
  var amnt = parseInt(amount)    // amount is string value, it will be changed to integer value
  if (acno in userDetails) {     // check acno number in database
    if (password == userDetails[acno]["password"]) {
      if (amnt <= userDetails[acno]["balance"]) {
        userDetails[acno]["balance"] = userDetails[acno]["balance"] - amnt
        userDetails[acno]['transaction'].push({ type: 'DEBIT', amount: amnt })

        return {
          statusCode: 200,
          status: true,
          message: userDetails[acno]["balance"]
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: "insufficient balance"
        }
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "incorrect password"
      }
    }
  }
  else {
    return {
      statusCode: 401,
      status: false,
      message: "incorrect acno"
    }
  }
}

gettransactions = (acno) => {
  if (acno in userDetails) {
    return {
      statusCode: 200,
      status: true,
      message: userDetails[acno]["transaction"]
    }
  }
  else {
    return {
      statusCode: 401,
      status: false,
      message: "incorrect acno"
    }
  }
}


module.exports = {
  register,
  login,
  deposit,
  withdraw,
  gettransactions
}  // functions of one file and folder can be imported to the required file...//similarly export required data from the imported file
// export file - module.exports={}
// export folder - package.exports{}
