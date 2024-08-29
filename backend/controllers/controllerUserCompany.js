const { UserCompany, Company} = require('../database/database');

const getAllUserCompanies = async (req, res) => {
  try {
    const userCompanies = await UserCompany.findAll();
    res.status(200).json(userCompanies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createCompany = async (req, res, internal = false) => {
  try {
    const { comp_name, comp_siret, comp_addre, comp_posta, comp_city } = req.body;

    // Check if the company already exists by SIRET
    let company = await Company.findOne({ where: { comp_siret } });

    if (!company) {
      // Create company if it does not exist
      const companyData = {
        comp_name,
        comp_siret,
        comp_addre,
        comp_posta,
        comp_city
      };

      company = await Company.create(companyData);
    }

    if (!internal) {
      res.status(201).json(company);
    } else {
      return company;
    }
  } catch (error) {
    if (!internal) {
      res.status(500).json({ error: error.message });
    } else {
      throw new Error(error.message);
    }
  }
};


const createUserCompany = async (req, res, internal = false) => {
  try {
    const { user_id, comp_id } = req.body;

    // Check if relationship already exists to avoid duplication
    const userCompany = await UserCompany.findOne({ where: { user_id, comp_id } });

    if (!userCompany) {
      // Create user-company relationship
      const newUserCompany = await UserCompany.create({ user_id, comp_id });

      if (!internal) {
        res.status(201).json(newUserCompany);
      } else {
        return newUserCompany;
      }
    } else {
      if (!internal) {
        res.status(400).json({ message: 'Relationship already exists' });
      } else {
        return userCompany;
      }
    }
  } catch (error) {
    if (!internal) {
      res.status(500).json({ error: error.message });
    } else {
      throw new Error(error.message);
    }
  }
};



module.exports = {
  getAllUserCompanies,
  createCompany,
  createUserCompany,
};
