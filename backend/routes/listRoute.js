const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/roleAuth')
const {getLists,addList,deleteList,deleteGuest,addGuest} = require('../controllers/lists.controller')


router.post('/', addList)
router.get('/', getLists)
router.delete('/:id', deleteList)
router.delete('/:listId/:guestId', deleteGuest)
router.post('/:id/guests', addGuest)

module.exports = router