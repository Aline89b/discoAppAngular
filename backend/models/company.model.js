const mongoose = require('mongoose')
const { timestamp } = require('rxjs')

const companySchema = mongoose.Schema({
    name:{ type: String},
    regione_sociale:{type: String},
    PI: {type:String},
    SDI:{type:String},
    email:{type: String }, 
    phone:{ type: String },
    address:{ type: String },
    city:{ type: String },
    zipCode:{ type: String },
    ownerId:{type: String},
    timestamp:{
        type:Date,
        default:Date.now
    }
 
     
})
   
    


const Company = mongoose.model("Company",companySchema)

module.exports = Company;


