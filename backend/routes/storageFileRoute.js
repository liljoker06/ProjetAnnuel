const express = require('express');
const router = express.Router();
const storageFileController = require('../controllers/controllerStorageFile');

router.get('/', storageFileController.getAllStorageFiles);
router.post('/', storageFileController.createStorageFile);


module.exports = router;
