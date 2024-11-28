const express = require('express')
const router = express.Router()

const {addEvent, getEvents, getEventsByCompany, deleteEvent,getEventsByLocale,getEventById,editEvent} = require('../controllers/events.controller')
const {authorizeRole,authenticateUser} = require('../middlewares/roleAuth')


router.post('/',authenticateUser,authorizeRole('Admin','Manager','staff'), addEvent)
router.get('/',authenticateUser,authorizeRole('Admin'), getEvents)
router.get('/byCompany', getEventsByCompany)
router.delete('/:id',authenticateUser,authorizeRole('Admin','Manager'), deleteEvent)
router.get('/byLocale', getEventsByLocale)
router.get('/:id', getEventById)
router.patch('/:id', editEvent)




module.exports = router