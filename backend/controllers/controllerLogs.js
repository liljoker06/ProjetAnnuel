const { Logs } = require('../database/database');

const getAllLogs = async (req, res) => {
  try {
    const logs = await Logs.findAll();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createLog = async (req, res) => {
  try {
    const log = await Logs.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllLogs,
  createLog,
};
