// server-mongoDB integration - 
// ---------------------------------

// 1.) Import mongoose
const mongoose = require('mongoose')

// 2.) state connection string via mongoose
mongoose.connect("mongodb://127.0.0.1/bankserver", { useNewUrlParser: true });

// 3.) define a database model
const User = mongoose.model('User', {
    acno: Number,
    username: String,
    password: Number,
    balance: Number,
    transaction: []
})

// 4.) export the schema to use in another file
module.exports = {
    User
}