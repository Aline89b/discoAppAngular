const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/roleAuth')

const {addEvent, getEvents, getEventsByCompany, deleteEvent} = require('../controllers/events.controller')


router.post('/', addEvent)
router.get('/', getEvents)
router.get('/byCompany', getEventsByCompany)
router.delete('/:id', deleteEvent)




module.exports = router