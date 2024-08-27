const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllerUser');
const validateUser = require('../middleware/validateUser');


router.get('/', userController.getAllUsers);
router.post('/create', validateUser, userController.createUser);
router.post('/validateEmail', userController.validateUserEmail);


module.exports = router;
