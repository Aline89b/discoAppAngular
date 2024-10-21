const mongoose = require('mongoose')
const { timestamp } = require('rxjs')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required:[false]
    },
    role:{
        type: String,
        required:[true]
    }, 
    mail:{
        type: String,
        required: [true, "please enter a valid e mail"] ,
        unique: [true, "email must be unique"],
        select: false
     
    },
    pw:{
        type: String,
        required: [true, "please enter a valid password"]
    },
    forgotPwCode:{
        type: String,
        select: false
    },
    forgotPwCodeValidation:{
        type: Number,
        select: false
    },
    verified: {
        type: Boolean,
        default: false,
      },
    timestamp:{
        type:Date,
        default:Date.now
    }

})

const User = mongoose.model("User", userSchema)

module.exports = User;