const express = require('express');
const router = express.Router();
const fileController = require('../controllers/controllerFile');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware pour vérifier le token

router.post('/upload', authenticateToken, fileController.uploadFile);
router.get('/', fileController.getAllFiles);

router.delete('/deleteFiles/:file_id', fileController.deleteFile);
router.put('/updateFiles/:file_id', fileController.updateFile);

// Route pour obtenir tous les fichiers de l'utilisateur via id
router.get('/', authenticateToken, fileController.getfilebyuserid);

// Route pour obtenir un fichier via id

router.post('/userfile', authenticateToken, fileController.getAllFilesbyUser);


module.exports = router;