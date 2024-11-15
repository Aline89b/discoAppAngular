const {List} = require('../models/list.model')
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

    // Send a success response
    res.status(200).json({ message: 'Guest removed successfully', result });
        
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

module.exports = { addList, getLists,deleteList, deleteGuest, addGuest }