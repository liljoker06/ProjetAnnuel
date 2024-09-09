const express = require('express');
const router = express.Router();
const fileController = require('../controllers/controllerFile');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware pour vérifier le token

// Route pour uploader un fichier
router.post('/upload', authenticateToken, fileController.uploadFile);

module.exports = router;