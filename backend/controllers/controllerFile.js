const fs = require('fs');
const path = require('path');
const { File, StorageFile, UserStorage } = require('../database/database');

const consoleLog = require('../consoleLog');

const getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour uploader un fichier
const uploadFile = async (req, res) => {
  try {
    // Vérification si un fichier est inclus dans la requête
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'Aucun fichier uploadé.' });
    }

    const file = req.files.file;
    const userId = req.user.userId;



    // Définir le chemin du répertoire utilisateur (doit déjà être créé lors de la création du compte)
    const userFolderPath = path.join(__dirname, '..', 'user_storage', userId);

    // Vérifier si le dossier utilisateur existe
    if (!fs.existsSync(userFolderPath)) {
      return res.status(400).json({ message: 'Le dossier utilisateur n\'existe pas.' });
    }

    const filePath = path.join(userFolderPath, file.name);

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

    // Trouver ou créer un enregistrement UserStorage pour l'utilisateur
    const userStorage = await UserStorage.findOne({ where: { user_id: userId } });
    if (!userStorage) {
      return res.status(400).json({ message: 'Le stockage de l\'utilisateur n\'existe pas.' });
    }
    // Créer une liaison entre le fichier et le stockage utilisateur
    await StorageFile.create({
      file_id: newFile.file_id,
      stor_id: userStorage.stor_id
    });

    // Répondre avec succès
    res.status(201).json({ message: 'Fichier uploadé avec succès', file: newFile });
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload du fichier.' });
  }
};


const getfilebyuserid = async (req, res) => {
  try {
    const userId = req.user.userId;
    const files = await File.findAll({ where: { file_userid: userId } });

    res.status(200).json(files);
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des fichiers.' });
  }
};

const getAllFilesbyUser = async (req, res) => {
  const userId = req.user.userId;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('Aucun en-tête d\'autorisation trouvé', 'red');
    return res.status(401).json({ message: 'Aucun en-tête d\'autorisation trouvé' });
  }

  try {
    console.log(`Début de la récupération des fichiers pour l'utilisateur: ${userId}`);

    // Trouver l'ID de stockage de l'utilisateur
    const userStorage = await UserStorage.findOne({ where: { user_id: userId } });
    if (!userStorage) {
      console.log('Espace de stockage utilisateur non trouvé.');
      return res.status(404).json({ message: 'Espace de stockage utilisateur non trouvé.' });
    }
    console.log(`Espace de stockage trouvé: ${userStorage.stor_id}`);

    // Trouver tous les fichiers de stockage associés à cet espace de stockage
    const storageFiles = await StorageFile.findAll({ where: { stor_id: userStorage.stor_id } });
    const fileIds = storageFiles.map(storageFile => storageFile.file_id);
    console.log(`Fichiers de stockage trouvés: ${fileIds.length} fichiers`);

    // Trouver tous les fichiers correspondants dans la table File
    const files = await File.findAll({ where: { file_id: fileIds } });
    console.log(`Fichiers trouvés dans la table File: ${files.length} fichiers`);


    res.status(200).json(files);
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des fichiers.' });
  }
};

const deleteFile = async (req, res) => {
  const { file_id } = req.params;

  try {
    const file = await File.findOne({ where: { id: file_id } });

    if (!file) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    await file.destroy();
    res.status(200).json({ message: 'Fichier supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFile = async (req, res) => {
  const { file_id } = req.params;

  try {
    const file = await File.findOne({ where: { id: file_id } });

    if (!file) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    await file.update(req.body);
    res.status(200).json({ message: 'Fichier mis à jour avec succès', file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadFile,
  getfilebyuserid,
  getAllFilesbyUser,
  getAllFiles,
  deleteFile,
  updateFile,
};

