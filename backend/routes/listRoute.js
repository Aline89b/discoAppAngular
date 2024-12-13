const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/roleAuth')
const {getLists,addList,deleteList,deleteGuest,addGuest,getListsById, getGuestById,changeStatusGuest,editList} = require('../controllers/lists.controller')
const {authorizeRole, authenticateUser }= require('../middlewares/roleAuth')


router.post('/', authenticateUser,authorizeRole('PR','admin','Manager'), addList)
router.get('/', authenticateUser,authorizeRole('admin','Manager'),getLists)
router.delete('/:id', authenticateUser,authorizeRole('PR','admin','Manager'), deleteList)
router.delete('/:listId/:guestId',authenticateUser,authorizeRole('PR','admin','Manager'), deleteGuest)
router.post('/:id/guests',authenticateUser, authorizeRole('PR','admin','Manager'), addGuest)
router.get('/:id',getListsById)
router.get('/:listId/:guestId',authenticateUser,authorizeRole('PR','admin','Manager'), getGuestById)
router.patch('/:listId/:guestId', changeStatusGuest)
router.patch('/:id', editList)


module.exports = router