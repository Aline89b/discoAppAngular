const express = require('express')
const router = express.Router()
const {getCompanies, addCompany,getCompanyByOwnerId}  = require('../controllers/companies.controller')


router.post('/', addCompany)
router.get('/', getCompanies)
router.get('/', getCompanyByOwnerId)


module.exports = router