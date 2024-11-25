const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/roleAuth')
const {getLists,addList,deleteList,deleteGuest,addGuest,getListsById} = require('../controllers/lists.controller')
const {authorizeRole, authenticateUser }= require('../middlewares/roleAuth')


router.post('/', authenticateUser,authorizeRole('PR','admin'), addList)
router.get('/', authenticateUser,authorizeRole('admin'),getLists)
router.delete('/:id', authenticateUser,authorizeRole('PR'), deleteList)
router.delete('/:listId/:guestId',authorizeRole('PR','admin'), deleteGuest)
router.post('/:id/guests', authorizeRole('PR','admin'), addGuest)
router.get('/:id',getListsById)

module.exports = router