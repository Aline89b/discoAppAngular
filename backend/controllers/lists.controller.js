const {List, Guest} = require('../models/list.model');
const qrcode = require('../models/qrcode.model');
const User = require('../models/users.model')
const mongoose = require('mongoose');


const getLists = async (req, res) =>{
    try {
        const lists = await List.find().populate('guests').populate('event', 'name')
        res.status(200).json(lists)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const addList =async (req,res) =>{
    const { listData } = req.body
const { name, surname, event, noOfFriends, guests, userId } = listData
console.log(req.body)

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const companyId = user.companyId;
    const list = await List.create({name, surname, event, guests,noOfFriends,createdBy:userId, company: companyId })
        console.log(list)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deleteList= async(req, res)=>{
    try {
        const { id } = req.params;
        console.log(id)
        const list = await List.findByIdAndDelete(id);
       
        if (!list) {
          return res.status(404).json({ message: "list not found" });
        }
        const updatedList = await List.find({});
        res.status(200).json(updatedList);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

deleteGuest = async(req, res) => {
    const {listId, guestId} = req.params
    console.log(listId,guestId)
    try {
      

    const result = await List.updateOne(
        { _id: new mongoose.Types.ObjectId(`${listId}`) },   // Find the guest list by its ID
        { $pull: { guests: { _id: new mongoose.Types.ObjectId(`${guestId}`) } } }, // Pull the guest by its ID
        { new: true }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Guest not found in the list or already removed' });
    }

   
    res.status(200).json({ message: 'Guest removed successfully', result });
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

getGuestById = async(req, res) =>{
    const { guestId, listId} = req.params
    console.log(guestId, listId)
    try {
                const list = await List.findById(listId);
         if (!list) {
             return res.status(404).json({ message: 'List not found' });
         }
 
        
         const guest = list.guests.find((guest) => guest._id.toString() === guestId);
 
         if (!guest) {
             return res.status(404).json({ message: 'Guest not found' });
         }
 
       
        res.status(200).json(guest)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
changeStatusGuest = async(req, res) =>{
    const { guestId, listId} = req.params
    console.log(guestId, listId)
    try {
                const list = await List.findById(listId);
         if (!list) {
             return res.status(404).json({ message: 'List not found' });
         }

         checkQRcode = await qrcode.findOne({ guestId, listId });

         if (!checkQRcode) {
             return res.status(404).json({ message: 'QR code not found.' });
         }
         if (checkQRcode.scanned) {
            return res.status(400).json({ message: 'QR code already scanned.' });
        }
        qrcode.scanned = true;
        await qrcode.save();
                
         const updatedList = await List.findOneAndUpdate(
            { _id: listId, 'guests._id': guestId }, 
            { $set: { 'guests.$.status': 'attended' , 'guests.$.qrcode': 'scanned' } }, 
            { new: true } 
        );
 
         if (!updatedList) {
             return res.status(404).json({ message: 'Guest not found' });
         }

          
       
        res.status(200).json({message: ' guest updated',updatedList})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


addGuest = async(req,res) =>{

    const { guestData } = req.body
    const { listId } = guestData;
    const [guest] = guestData.guests; 
    const { name, surname,phone,noOfFriends } = guest
   
    try {
        const objectId = new mongoose.Types.ObjectId(`${listId}`);

       const updatedList = await List.findByIdAndUpdate(
      objectId,
      { $push: { guests: { name, surname, phone, noOfFriends } } },
      { new: true }  
    );

    if (!updatedList) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.status(200).json({ message: 'Guest added to the list', updatedList })
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
const getListsById = async (req,res) =>{

    const { createdBy } = req.params
    try{
   
      const lists = await List.findById(createdBy)
      res.status(200).json(lists)
  }catch(error){
      res.status(500).json({message:error.message})
  }
  
  }

  const editList = async(req,res) =>{
  
        
        const { id,name, event, guests } = req.body; 
    
        try {
           
            const list = await List.findById(id);
    
            if (!list) {
                return res.status(404).json({ message: "List not found" });
            }
    
           
            if (name) list.name = name;
            if (event) list.event = event;
            if (guests && Array.isArray(guests)) {
                list.guests = guests; 
            }
    
           
            const updatedList = await list.save();
    
            res.status(200).json({ message: "List updated successfully", updatedList });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
  }

module.exports = { addList, getLists,deleteList, deleteGuest, addGuest,getListsById, getGuestById,changeStatusGuest, editList }