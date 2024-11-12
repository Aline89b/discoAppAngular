const express = require('express')
const router = express.Router()
const {getCompanies, addCompany,getCompanyByOwnerId, deleteCompany}  = require('../controllers/companies.controller')


router.post('/', addCompany)
router.get('/', getCompanies)
router.get('/:id', getCompanyByOwnerId)
router.delete('/:id', deleteCompany)


module.exports = router