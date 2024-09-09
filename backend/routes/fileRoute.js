const express = require('express');
const router = express.Router();
const fileController = require('../controllers/controllerFile');

router.get('/', fileController.getAllFiles);
router.post('/', fileController.createFile);
router.delete('/deleteFiles/:file_id', fileController.deleteFile);
router.put('/updateFiles/:file_id', fileController.updateFile);


module.exports = router;
