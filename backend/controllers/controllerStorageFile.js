const { StorageFile } = require('../database/database');

const getAllStorageFiles = async (req, res) => {
  try {
    const storageFiles = await StorageFile.findAll();
    res.status(200).json(storageFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStorageFile = async (req, res) => {
  try {
    const storageFile = await StorageFile.create(req.body);
    res.status(201).json(storageFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStorageFiles,
  createStorageFile,
};
