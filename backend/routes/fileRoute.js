const express = require('express');
const multer = require('multer');
const router = express.Router();
const fileController = require('../controllers/controllerStorageFile');
const userStorageController = require('../controllers/controllerUserStorage');

// Configuration de multer pour gérer le stockage des fichiers sur le serveur
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nom unique pour éviter les conflits
  }
});

const upload = multer({ storage: storage });

router.post('/upload/:userId', upload.single('file'), async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const fileSize = req.file.size; // Taille du fichier uploadé
    
    // Vérification de la limite de stockage
    const { allowedStorage, usedStorage } = await userStorageController.checkStorageLimit(req, res);
    
    if (usedStorage + fileSize > allowedStorage) {
      return res.status(400).json({ message: 'Limite de stockage dépassée.' });
    }

    // Appel au contrôleur pour traiter l'upload du fichier
    await fileController.uploadFile(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
