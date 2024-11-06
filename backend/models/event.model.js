const mongoose = require('mongoose')
const { timestamp } = require('rxjs')

const eventSchema = mongoose.Schema({
    name:{ type: String},
    locale:{type:String},
    time:{type: String},
    date: {type: String},
    createdBy:{type: String},
    PR:{type: String},
    timestamp:{
        type:Date,
        default:Date.now
    }

     
})
   
    


const Event = mongoose.model("Event",eventSchema)

module.exports = Event;

