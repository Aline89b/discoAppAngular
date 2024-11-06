const mongoose = require('mongoose')
const { timestamp } = require('rxjs')

const localeSchema = mongoose.Schema({

    name:{ type: String},
    email:{type: String }, 
    phone:{ type: String },
    address:{ type: String },
    city:{ type: String },
    zipCode:{ type: String },
    capacity:{type: Number},
    eventId:{type: String},
    userId:{type: String},
    timestamp:{
        type:Date,
        default:Date.now
    }

     
})
   
    


const Locale = mongoose.model("Locale",localeSchema)

module.exports = Locale;

