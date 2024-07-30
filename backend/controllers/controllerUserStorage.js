const { UserStorage } = require('../database/database');

const getAllUserStorages = async (req, res) => {
  try {
    const userStorages = await UserStorage.findAll();
    res.status(200).json(userStorages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUserStorage = async (req, res) => {
  try {
    const userStorage = await UserStorage.create(req.body);
    res.status(201).json(userStorage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUserStorages,
  createUserStorage,
};
