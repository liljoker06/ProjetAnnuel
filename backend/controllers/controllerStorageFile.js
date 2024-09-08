const { UserStorage } = require('../database/database');
const { StorageFile } = require('../database/database');
const fs = require('fs'); 

// Fonction pour obtenir tous les fichiers de stockage
const getAllStorageFiles = async (req, res) => {
  try {
    const storageFiles = await StorageFile.findAll();
    res.status(200).json(storageFiles);
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers de stockage:', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Fonction existante pour l'upload
const uploadFile = async (req, res) => {
  const userId = req.params.userId;
  const filePath = req.file.path;

  try {
    log(`[START] uploadFile - Début de l'upload pour l'utilisateur ${userId}`, 'START');

    // Mettre à jour le stockage utilisé par l'utilisateur
    log(`[INFO] uploadFile - Récupération du stockage de l'utilisateur ${userId}`, 'INFO');
    const userStorage = await UserStorage.findOne({ where: { user_id: userId } });

    if (!userStorage) {
      log(`[ERROR] uploadFile - Utilisateur non trouvé : ${userId}`, 'ERROR');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Ajout de la taille du fichier au stockage utilisé
    log(`[INFO] uploadFile - Mise à jour du stockage utilisé de l'utilisateur ${userId}`, 'INFO');
    userStorage.used_storage += req.file.size;
    await userStorage.save();

    log(`[SUCCESS] uploadFile - Stockage mis à jour pour l'utilisateur ${userId}`, 'SUCCESS');

    // Réponse succès
    res.status(200).json({ message: 'Fichier uploadé avec succès', filePath });

    log(`[END] uploadFile - Fin de l'upload pour l'utilisateur ${userId}`, 'END');
  } catch (error) {
    log(`[ERROR] uploadFile - Erreur lors de l'upload pour l'utilisateur ${userId} : ${error.message}`, 'ERROR');
    res.status(500).json({ message: 'Erreur lors de l\'upload du fichier.' });
  }
};


module.exports = {
  getAllStorageFiles,
  uploadFile,
};
