const express = require('express')
const router = express.Router()
const {authorizeRole, authenticateUser} = require('../middlewares/roleAuth')

const { getLocali, createLocale, deleteLocale,getLocaleListById,getPlaceById,editPlace,getPlacesByCompany }  = require('../controllers/locali.controller')


router.post('/',authenticateUser,authorizeRole('admin', 'Manager'), createLocale)
router.get('/',authenticateUser, authorizeRole('admin','Manager'), getLocali)
router.delete('/:id', authenticateUser,authenticateUser,authorizeRole('admin', 'Manager'), deleteLocale)
router.get('/byUser/:userId',getLocaleListById)
router.get('/:id', getPlaceById)
router.patch('/:id', editPlace)
router.get('/byCompany', getPlacesByCompany)



module.exports = router