const express = require('express')
const router = express.Router()

const {sendQRcode,getQRcode} = require('../controllers/qrcode.controller')


router.post('/:listId/:guestId',sendQRcode)
router.get('/:listId/:guestId.png',getQRcode)


module.exports = router

