const mongoose = require('mongoose')
const { timestamp } = require('rxjs')

const userSchema = mongoose.Schema({
    name:{
        type: String
        
    },
    role:{
        type: String,
        required:[true]
    }, 
    email:{
        type: String,
        required: [true, "please enter a valid e mail"] ,
        
     
    },
    password:{
        type: String,
        required: [true, "please enter a valid password"]
    },
    verificationCode:{
        type: Number,
        select: false
    },
    verificationCodeExpires:{
        type: Number,
        select: false
    },
    verified: {
        type: Boolean,
        default: false,
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required:false
        
      },
      
      token: {
type: String
      },
    timestamp:{
        type:Date,
        default:Date.now
    }

})
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema)
User.createIndexes();  // This explicitly creates the index

module.exports = User;