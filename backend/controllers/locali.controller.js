const { localeSchema } = require("../middlewares/validators");
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
    const EditedPlace = await Event.findByIdAndUpdate(
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

module.exports= {createLocale,getLocali, deleteLocale, getLocaleListById, getPlaceById, editPlace}