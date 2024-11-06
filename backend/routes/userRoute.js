const express = require('express')
const router = express.Router()
const authorizeRole = require('../middlewares/roleAuth')
const {getUsers, addUser, updatedUser, deleteUser, logIn, logOut, verifyUser, resetPWrequest, resetPW, inviteUser} = require('../controllers/users.controller')

router.get('/',authorizeRole('admin'), getUsers)
router.post('/', addUser)
router.patch('/:id', updatedUser)
router.delete('/:id', deleteUser)
router.post('/login', logIn)
router.post('/logout', logOut)
router.get('/verify/:id/:token', verifyUser)
router.post('/resetPWrequest', resetPWrequest)
router.patch('/resetPW/:id', resetPW)
router.post('/invite-user',authorizeRole('manager'), inviteUser)



module.exports = router