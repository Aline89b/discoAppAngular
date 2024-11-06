const { companySchema } = require("../middlewares/validators");
const Company = require("../models/company.model")

const getCompanies = async(req, res)=>{
    try {
        const companies = await Company.find({});
    res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getCompanyByOwnerId  = async(req, res) =>{
    const { companyData } = req.body; // Extract `companyData` from `req.body`
    if (!companyData) {
        return res.status(400).json({ message: 'Missing company data' });
    }
    const { userId } = companyData;

    try{
       
        const company = await Company.findById(userId)
        res.status(200).json(company)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
   



const addCompany = async(req, res) =>{
    const { companyData } = req.body; // Extract `companyData` from `req.body`
    if (!companyData) {
        return res.status(400).json({ message: 'Missing company data' });
    }

    const { name, regione_sociale, PI, SDI, address, city, zipCode, email, phone, userId } = companyData;
   
    console.log(req.body)
    console.log(companyData)
       try {
        const { error, value } = companySchema.validate({
            name,regione_sociale,PI,SDI,address, city,zipCode, email, phone, userId
        });
    
        if (error) {
          return res
            .status(401)
            .json({ success: false, message: error.details[0].message });
        }
        const ExistingCompany = await Company.findOne({ PI });
    if (ExistingCompany) {
      return res
        .status(401)
        .json({ success: false, message: "company already exists" });
    }
        const company = await Company.create({ name, regione_sociale,PI, SDI,address,city,zipCode,phone,email,userId })
        
        console.log(company)
        res.status(200).json({message:'company created successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = {addCompany,getCompanies,getCompanyByOwnerId}