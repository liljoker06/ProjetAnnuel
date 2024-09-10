const express = require('express');
const router = express.Router();
const storageFileController = require('../controllers/controllerStorageFile');

// Route pour obtenir tous les fichiers de stockage (par exemple, tous les fichiers uploadés par tous les utilisateurs)
router.get('/', storageFileController.getAllStorageFiles);

// Route pour uploader un fichier pour un utilisateur spécifique
router.post('/upload', storageFileController.uploadFile);

module.exports = router;
