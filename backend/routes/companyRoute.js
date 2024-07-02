const express = require('express');
const router = express.Router();
const companyController =  require ('../controllers/contollerCompany');


router.get('/', companyController.getAllCompanies);
router.post('/' , companyController.createCompany);

module.exports = router;

