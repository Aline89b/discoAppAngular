const express = require('express')
const router = express.Router()
const {authorizeRole, authenticateUser} = require('../middlewares/roleAuth')

const {search,getSearchDetail} = require('../controllers/search.controller')

router.post('/', search)
router.get('/searchDetail/:id',authenticateUser, getSearchDetail)

module.exports = router