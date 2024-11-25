const mongoose = require('mongoose')
const { timestamp } = require('rxjs')

const companySchema = mongoose.Schema({
    name:{ type: String, required:true},
    regione_sociale:{type: String, required:true},
    PI: {type:String, required:true},
    SDI:{type:String, required:true},
    email:{type: String, required:true }, 
    phone:{ type: String, required:true },
    address:{ type: String, required:true },
    city:{ type: String , required:true},
    zipCode:{ type: String, required:true },
    ownerId:{type: String, required:true},
    timestamp:{
        type:Date,
        default:Date.now
    }
 
     
})
   
    


const Company = mongoose.model("Company",companySchema)

module.exports = Company;


