const express = require('express')
const router = express.Router()
const {getUsers, addUser, updatedUser, deleteUser, logIn, logOut, verifyUser, resetPW} = require('../controllers/users.controller')

router.get('/', getUsers)
router.post('/', addUser)
router.patch('/:id', updatedUser)
router.delete('/:id', deleteUser)
router.post('/login', logIn)
router.post('/logout', logOut)
router.get('/verify', verifyUser)
router.patch('/resetPW', resetPW)




module.exports = router