const { Company } = require('../database/database');
const { Op } = require('sequelize');
const consoleLog = require('../consoleLog');

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validateCompany = async (req, res) => {

  consoleLog(`• [START] controllers/controllerCompany/validateCompany`, 'cyan');
  try {

    // Vérification si le nom de l'entreprise existe déjà
    const companyByName = await Company.findOne({
      where: { comp_name: req.body.comp_name }
    });
    if (companyByName) {
      consoleLog(`Nom de l'entreprise déjà utilisé: ${req.body.comp_name}`, 'red');
    } else {
      consoleLog(`Nom de l'entreprise valide: \t${req.body.comp_name}`, 'green');
    }

    // Vérification si le SIRET de l'entreprise existe déjà
    const companyBySiret = await Company.findOne({
      where: { comp_siret: req.body.comp_siret }
    });
    if (companyBySiret) {
      consoleLog(`SIRET déjà utilisé: \t\t${req.body.comp_siret}`, 'red');
    } else {
      consoleLog(`SIRET valide: \t\t\t${req.body.comp_siret}`, 'green');
    }

    // Renvoie de la réponse
    if (companyByName) {
      res.status(200).json({ isValid: false, isName: true });
    } else if (companyBySiret) {
      res.status(200).json({ isValid: false, isSiret: true });
    } else {
      res.status(200).json({ isValid: true });
    }

  } catch (error) {
    consoleLog(`Erreur lors de la validation de l'entreprise: \t\t${error.message}`, 'red');
    res.status(500).json({ error: error.message });
  }

  consoleLog(`• [END] controllers/controllerCompany/validateCompany`, 'cyan');
};

const validateCompanyCode = async (req, res) => {
  consoleLog(`• [START] controllers/controllerCompany/validateCompanyCode`, 'cyan');
  try {
    const company = await Company.findOne({
      where: {
        comp_code: req.body.comp_code,
      },
    });

    if (company) {
      consoleLog(`Code de l'entreprise valide: \t${req.body.comp_code}`, 'green');
      res.status(200).json({ isValid: true });
    } else {
      consoleLog(`Code de l'entreprise inconnu: \t${req.body.comp_code}`, 'red');
      res.status(200).json({ isValid: false });
    }
  } catch (error) {
    consoleLog(`Erreur lors de la validation du code de l'entreprise: \t${error.message}`, 'red');
    res.status(500).json({ error: error.message });
  }
  consoleLog(`• [END] controllers/controllerCompany/validateCompanyCode`, 'cyan');
};

module.exports = {
  getAllCompanies,
  createCompany,
  validateCompany,
  validateCompanyCode,
};