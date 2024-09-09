const fs = require('fs');
const path = require('path');
const { File } = require('../database/database'); 
const { v4: uuidv4 } = require('uuid'); // Générer un UUID pour chaque fichier

// Fonction pour uploader un fichier
const uploadFile = async (req, res) => {
  try {
    // Vérification si un fichier est inclus dans la requête
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'Aucun fichier uploadé.' });
    }

    const file = req.files.file;
    const userId = req.user.userId; 

    const fileId = uuidv4();

    // Définir le chemin du répertoire utilisateur (doit déjà être créé lors de la création du compte)
    const userFolderPath = path.join(__dirname, '..', 'user_storage', userId);
    
    // Vérifier si le dossier utilisateur existe
    if (!fs.existsSync(userFolderPath)) {
      return res.status(400).json({ message: 'Le dossier utilisateur n\'existe pas.' });
    }

    const filePath = path.join(userFolderPath, fileId + path.extname(file.name));

    // Déplacer le fichier vers le répertoire utilisateur
    await file.mv(filePath);

    // Préparer les informations du fichier pour la base de données
    const fileData = {
      file_userid: userId,
      file_name: file.name,
      file_size: file.size,
      file_form: path.extname(file.name), // Format de fichier (extension)
      file_path: filePath,
      file_updat: new Date(), // Date de création
      file_modat: new Date(), // Date de modification
    };

    // Afficher les informations du fichier avant la création
    console.log('Informations du fichier avant la création:', fileData);

    // Enregistrer les informations du fichier dans la base de données
    const newFile = await File.create(fileData);

    // Répondre avec succès
    res.status(201).json({ message: 'Fichier uploadé avec succès', file: newFile });
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload du fichier.' });
  }
};

module.exports = {
  uploadFile,
};

