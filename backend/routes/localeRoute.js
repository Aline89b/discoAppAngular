const express = require('express')
const router = express.Router()
const { getLocali, createLocale, deleteLocale }  = require('../controllers/locali.controller')


router.post('/', createLocale)
router.get('/', getLocali)
router.delete('/:id', deleteLocale)



module.exports = router