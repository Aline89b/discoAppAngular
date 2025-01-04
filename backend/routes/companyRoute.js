const express = require('express')
const router = express.Router()
const {getCompanies, addCompany,getCompanyByOwnerId, deleteCompany, getCompanyById}  = require('../controllers/companies.controller')
const {authorizeRole,authenticateUser} = require('../middlewares/roleAuth')


router.post('/',authenticateUser,authorizeRole('Admin','Manager' ), addCompany)
router.get('/',authenticateUser,authorizeRole('Admin'), getCompanies)
router.get('/owner/:id', getCompanyByOwnerId)
router.get('/:id', getCompanyById)
router.delete('/:id',authenticateUser,authorizeRole('Admin'), deleteCompany)


module.exports = router