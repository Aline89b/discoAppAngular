const mongoose = require('mongoose')
const { timestamp } = require('rxjs')
const mongoose = require('mongoose')


const localeSchema = mongoose.Schema({

    name:{ type: String, required:true},
    email:{type: String , required:false}, 
    phone:{ type: String, required:false },
    address:{ type: String, required:true },
    city:{ type: String },
    zipCode:{ type: String },
    capacity:{type: Number, required:true},
    eventId:{type: String},
    userId:{type: String},
    timestamp:{
        type:Date,
        default:Date.now
    }

     
})
   
    


const Locale = mongoose.model("Locale",localeSchema)

module.exports = Locale;

