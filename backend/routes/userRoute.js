const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllerUser');
const validateUser = require('../middleware/validateUser');


router.get('/', userController.getAllUsers);
router.post('/create', validateUser, userController.createUser);
router.post('/login', userController.loginUser);
router.post('/validateEmail', userController.validateUserEmail);
router.post('/validateUser', userController.validateUser);



module.exports = router;
