const Event = require("../models/event.model")

const getEvents = async(req,res)=>{
    try {
        const events = await Event.find({})
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const addEvent = async (req,res) =>{
    const {eventData} = req.body

    const {name, locale, date, time, price } = eventData

    try {

const event = await Event.create({name, locale,date,time,price})
console.log(event)
        res.status(201).json({message: ' event saved successfully', event})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {addEvent, getEvents}