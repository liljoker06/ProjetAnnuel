const express = require('express');
const router = express.Router();
const currentSubController = require('../controllers/controllerCurrentSub');

router.get('/', currentSubController.getAllCurrentSubs);
router.post('/', currentSubController.createCurrentSub);


module.exports = router;
