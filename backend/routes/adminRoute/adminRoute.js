const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/controllerAdmin/controllerAdmin');

router.get('/', adminController.getAllUsers);

module.exports = router;