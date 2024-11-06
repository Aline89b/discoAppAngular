const express = require('express')
const router = express.Router()
const { getLocali, createLocale }  = require('../controllers/locali.controller')


router.post('/', createLocale)
router.get('/', getLocali)



module.exports = router