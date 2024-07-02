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

module.exports = {
  getAllFiles,
  createFile,
};
