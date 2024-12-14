const { localeSchema } = require("../middlewares/validators");
const Locale = require("../models/locale.model")
const mongoose = require('mongoose')
const User = require('../models/users.model');

const getLocali = async(req,res) => {
    
    try {
        const locali = await Locale.find({});
        res.status(200).json(locali);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
const createLocale = async(req,res)=>{
    const { localeData } = req.body

    const { name, address, city,zipCode, capacity,userId} = localeData

   
    try {
        const { error, value } = localeSchema.validate({ name, address, city,zipCode, capacity,userId });

        if (error) {
          return res
            .status(401)
            .json({ success: false, message: error.details[0].message });
        }
    
        const ExistingLocale = await Locale.findOne({ name: name, userId: userId });
        if (ExistingLocale) {
          return res
            .status(401)
            .json({ success: false, message: "locale already exists" });
        }
        const user = await User.findById({_id:new mongoose.Types.ObjectId(`${userId}`)});
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

       
        const { companyId } = user;

       const locale = await Locale.create({ name, address, city,zipCode,capacity,userId,companyId})
       console.log(locale)
       res.status(201).json({message:'locale has been saved'})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const deleteLocale= async(req, res)=>{
    try {
        const { id } = req.params;
        console.log(id)
        const locale = await Locale.findByIdAndDelete(id);
       
        if (!locale) {
          return res.status(404).json({ message: "locale not found" });
        }
        const updatedLocali = await Event.find({});
        res.status(200).json(updatedLocali);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const getLocaleListById = async (req,res) =>{

  const { userId } = req.params
  try{
 
    const locali = await Locale.findById({userId})
    res.status(200).json(locali)
}catch(error){
    res.status(500).json({message:error.message})
}

}

const getPlaceById = async(req,res) => {
  
  const { id } = req.params
  try{
 
    const locale = await Locale.findById(id)
    res.status(200).json(locale)
}catch(error){
    res.status(500).json({message:error.message})
}

}

const editPlace = async(req, res) => {
  const {id} = req.params
  const{ localeData } =req.body
  console.log(localeData)

  try {
    const EditedPlace = await Locale.findByIdAndUpdate(
      {_id: new mongoose.Types.ObjectId(`${id}`)},
      localeData,
      {new:true} 
    )
    console.log(EditedPlace)
    res.status(200).json(EditedPlace)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const getPlacesByCompany = async(req,res)=>{
  try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
      }
  
     
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
  
      const userId = decoded.userId;
      const user = await User.findById(userId);
      console.log('userId:',userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const companyId = user.companyId; 
      console.log('companyId:',companyId)
      if (!companyId) {
        return res.status(400).json({ error: 'User has no associated company' });
      }
   
      const places = await Locale.find({ companyId: companyId });
      console.log(places)
      res.status(200).json(places);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
}


module.exports= {createLocale,getLocali, deleteLocale, getLocaleListById, getPlaceById, editPlace,getPlacesByCompany}