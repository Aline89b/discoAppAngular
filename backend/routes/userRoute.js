const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/roleAuth')
const {getUsers, addUser, updatedUser, deleteUser, logIn, logOut, verifyUser, resetPWrequest, resetPW, inviteUser} = require('../controllers/users.controller')

router.get('/',roleAuth('admin'), getUsers)
router.post('/', addUser)
router.patch('/:id', updatedUser)
router.delete('/:id', deleteUser)
router.post('/login', logIn)
router.post('/logout', logOut)
router.get('/verify/:id/:token', verifyUser)
router.post('/resetPWrequest', resetPWrequest)
router.patch('/resetPW/:id', resetPW)
router.post('/invite-user',roleAuth('manager'), inviteUser)



module.exports = router