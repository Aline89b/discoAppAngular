const mongoose = require('mongoose')
const { timestamp } = require('rxjs');
const User = require('./users.model');

const eventSchema = mongoose.Schema({
    name:{ type: String, required:true},
    locale:{type:String, required:true},
    time:{type: String, required:true},
    date: {type: String, required:true},
    price:{type: Number, required:false},
    companyId:{type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Assuming lists are associated with users
        required: true},
    createdBy:{type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:false
    },
    timestamp:{
        type:Date,
        default:Date.now
    }

     
})
   
    


const Event = mongoose.model("Event",eventSchema)

module.exports = Event;

