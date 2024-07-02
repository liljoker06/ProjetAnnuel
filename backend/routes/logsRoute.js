const express = require('express');
const router = express.Router();
const logsController = require('../controllers/controllerLogs');

router.get('/', logsController.getAllLogs);
router.post('/', logsController.createLog);


module.exports = router;
