const express = require('express')
const router = express.Router()
const {search,getSearchDetail} = require('../controllers/search.controller')

router.post('/', search)
router.get('/searchDetail/:id', getSearchDetail)


module.exports = router