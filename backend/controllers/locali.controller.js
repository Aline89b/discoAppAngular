const Locale = require("../models/locale.model")

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
       const locale = await Locale.create({ name, address, city,zipCode,capacity,userId})
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
module.exports= {createLocale,getLocali, deleteLocale}