const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/controllerSubscription');

router.get('/', subscriptionController.getAllSubscriptions);
router.post('/', subscriptionController.createSubscription);


module.exports = router;
