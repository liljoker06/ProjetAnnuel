const { CurrentSub } = require('../database/database');

const getAllCurrentSubs = async (req, res) => {
  try {
    const currentSubs = await CurrentSub.findAll();
    res.status(200).json(currentSubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCurrentSub = async (req, res) => {
  try {
    const currentSub = await CurrentSub.create(req.body);
    res.status(201).json(currentSub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCurrentSubs,
  createCurrentSub,
};
