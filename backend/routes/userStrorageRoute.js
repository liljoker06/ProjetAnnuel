const express = require('express');
const router = express.Router();
const userStorageController = require('../controllers/controllerUserStorage');

router.get('/', userStorageController.getAllUserStorages);
router.post('/', userStorageController.createUserStorage);

router.get('/check/', userStorageController.checkStorageLimit);

module.exports = router;
