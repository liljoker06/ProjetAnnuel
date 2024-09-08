const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllerUser');
const validateUser = require('../middleware/validateUser');


router.get('/', userController.getAllUsers);
// router.post('/getByMail', userController.getUserByMail);
router.post('/getUserInfoByToken', userController.getUserInfoByToken);
router.post('/create', validateUser, userController.createUser);
router.post('/changeUserPassword', userController.changeUserPassword);
router.post('/login', userController.loginUser);
router.post('/validateEmail', userController.validateUserEmail);
router.post('/validateUser', userController.validateUser);
router.delete('/deleteUser/:userId', userController.deleteUser);
router.put('/updateUser/:userId', userController.updateUser);


module.exports = router;
