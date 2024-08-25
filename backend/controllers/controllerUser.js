const { User } = require('../database/models/modelUser');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');



const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({errors : errors.array()});
  }

  try {
    const {password} = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { ...req.body, user_passw: hashedPassword };

    const user = await User.create(userData);

    res.status(201).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
};
