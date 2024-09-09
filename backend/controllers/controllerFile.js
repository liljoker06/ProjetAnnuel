const { File } = require('../database/database');

const getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFile = async (req, res) => {
  try {
    const file = await File.create(req.body);
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  getAllFiles,
  createFile,
  deleteFile,
  updateFile,
};
