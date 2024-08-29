const express = require('express');
const router = express.Router();
const mailCodeController = require('../controllers/controllerMailCode');

router.post('/generate', mailCodeController.generateMailCode);
router.post('/validate', mailCodeController.validateMailCode);
router.post('/resend', mailCodeController.resendMailCode);

module.exports = router;