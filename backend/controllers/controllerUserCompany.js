const { UserCompany } = require('../database/database');

const getAllUserCompanies = async (req, res) => {
  try {
    const userCompanies = await UserCompany.findAll();
    res.status(200).json(userCompanies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUserCompany = async (req, res) => {
  try {
    const userCompany = await UserCompany.create(req.body);
    res.status(201).json(userCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUserCompanies,
  createUserCompany,
};
