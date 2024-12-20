const Event = require("../models/event.model")
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const { eventSchema } = require("../middlewares/validators");
const mongoose = require('mongoose');

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
    
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    
        const userId = decoded.userId;
        const user = await User.findById(userId);
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const companyId = user.companyId; 
        console.log('companyId:',companyId)
        if (!companyId) {
          return res.status(400).json({ error: 'User has no associated company' });
        }
    
      
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
      const { error, value } = eventSchema.validate({ name, locale, date, time, price,createdBy:userId});

      if (error) {
        return res
          .status(401)
          .json({ success: false, message: error.details[0].message });
      }
  
      const ExistingEvent = await User.findOne({ name: name, locale:locale });
      if (ExistingEvent) {
        return res
          .status(401)
          .json({ success: false, message: "event already exists" });
      }

        const user = await User.findById({_id:new mongoose.Types.ObjectId(`${userId}`)});
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

       
        const { companyId } = user;

        
        const event = await Event.create({
            name,
            locale,
            date,
            time,
            price,
            createdBy: new mongoose.Types.ObjectId(`${userId}`),
            companyId          
        });

        console.log('Event created:', event);

    
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
  
const getEventsByLocale = async(req, res) =>{
const { name } = req.params
console.log(name)
  try {
    const events = await Event.find({locale:name})
    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found for the specified locale' });
    }
    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}
const getEventById = async(req, res) =>{
const {id} = req.params  

    try {
      const event = await Event.findOne({_id: new mongoose.Types.ObjectId(`${id}`)})
      console.log(event)
      res.status(200).json(event)
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  const editEvent = async(req, res) => {
    const {id} = req.params
    const{ eventData } =req.body
    console.log(eventData)

    try {
      const EditedEvent = await Event.findByIdAndUpdate(
        {_id: new mongoose.Types.ObjectId(`${id}`)},
        eventData,
        {new:true} 
      )
      console.log(EditedEvent)
      res.status(200).json(EditedEvent)
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

module.exports = {addEvent, getEvents, getEventsByCompany, deleteEvent,getEventsByLocale,getEventById, editEvent}