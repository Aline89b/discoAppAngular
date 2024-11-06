const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/roleAuth')

const {addEvent, getEvents} = require('../controllers/events.controller')


router.post('/', addEvent)
router.get('/', getEvents)



module.exports = router