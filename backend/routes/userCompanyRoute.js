const express = require('express');
const router = express.Router();
const userCompanyController = require('../controllers/controllerUserCompany');

router.get('/', userCompanyController.getAllUserCompanies);
router.post('/', userCompanyController.createUserCompany);


module.exports = router;
