const Event = require("../models/event.model")
const jwt = require('jsonwebtoken');
const User = require('../models/users.model')

const getEvents = async(req,res)=>{
    try {
        const events = await Event.find({})
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getEventsByCompany = async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Authorization token required' });
        }
    
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your environment variables
    
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const companyId = user.companyId; 
        console.log(companyId)// Get companyId from the user document
        if (!companyId) {
          return res.status(400).json({ error: 'User has no associated company' });
        }
    
        // Fetch events associated with this companyId
        const events = await Event.find({ companyId: companyId });
        console.log(events)
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const addEvent = async (req,res) =>{
    const {eventData} = req.body

    const {name, locale, date, time, price,userId } = eventData

    try {

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Extract the companyId from the user document
        const { companyId } = user;

        // Create the event with createdBy and companyId
        const event = await Event.create({
            name,
            locale,
            date,
            time,
            price,
            createdBy: userId,  // setting createdBy to userId
            companyId           // setting companyId from user
        });

        console.log('Event created:', event);

        // Update the user with createdBy and companyId (optional, only if needed)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { createdBy: userId, companyId: companyId } },
            { new: true }
        );

        console.log('Updated User:', updatedUser);
        res.status(201).json({message: ' event saved successfully', event})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id)
      const event = await Event.findByIdAndDelete(id);
     
      if (!event) {
        return res.status(404).json({ message: "event not found" });
      }
      const updatedEvents = await Event.find({});
      res.status(200).json(updatedEvents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {addEvent, getEvents, getEventsByCompany, deleteEvent}