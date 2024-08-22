const express = require('express');
const router = express.Router();
const mailCodeController = require('../controllers/controllerMailCode');

router.post('/generate', mailCodeController.generateMailCode);
router.post('/validate', mailCodeController.validateMailCode);

module.exports = router;