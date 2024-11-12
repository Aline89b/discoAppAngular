const mongoose = require('mongoose')
const { timestamp } = require('rxjs');
const User = require('./users.model');

const eventSchema = mongoose.Schema({
    name:{ type: String},
    locale:{type:String},
    time:{type: String},
    date: {type: String},
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

