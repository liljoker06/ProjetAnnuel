const express = require('express');
const router = express.Router();
const companyController =  require ('../controllers/controllerCompany');


router.get('/', companyController.getAllCompanies);
router.post('/create' , companyController.createCompany);
router.post('/validateCode', companyController.validateCompanyCode);
router.post('/validate', companyController.validateCompany);

module.exports = router;

