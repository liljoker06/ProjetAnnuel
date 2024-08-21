const { User } = require('../database/database');
const bcrypt = require('bcryptjs');
const { validateResult } = require('express-validator');



const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const errors = validateResult(req);
  if (!errors.isEmpty()) {
    return res.statuts(400).json({ errors : errors.array()});
  }

  try {
    const {password} = req.body;
    
    // hash password
    const hachedPassword = await bcrypt.hash(password, 10);

    const userData = { ...req.body, password: hachedPassword };

    const user = await User.create(userData);

    res.status(201).json(user);

    } catch (error) {
      res.status(500).json({ error : error.message});
  }
};

module.exports = {
  getAllUsers,
  createUser,
};
