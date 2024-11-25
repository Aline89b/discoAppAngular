const express = require('express')
const router = express.Router()
const {getCompanies, addCompany,getCompanyByOwnerId, deleteCompany}  = require('../controllers/companies.controller')
const {authorizeRole,authenticateUser} = require('../middlewares/roleAuth')


router.post('/',authenticateUser,authorizeRole('Admin','Manager' ), addCompany)
router.get('/',authenticateUser,authorizeRole('Admin'), getCompanies)
router.get('/:id', getCompanyByOwnerId)
router.delete('/:id',authenticateUser,authorizeRole('Admin'), deleteCompany)


module.exports = router