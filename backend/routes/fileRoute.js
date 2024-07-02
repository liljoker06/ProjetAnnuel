const express = require('express');
const router = express.Router();
const fileController = require('../controllers/controllerFile');

router.get('/', fileController.getAllFiles);
router.post('/', fileController.createFile);


module.exports = router;
