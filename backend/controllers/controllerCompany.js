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

const getCompanyByCode = async (req, res, next) => {
  try {
    consoleLog(`req.params: ${JSON.stringify(req.params)}`, 'blue');
    consoleLog(`req.body: ${JSON.stringify(req.body)}`, 'blue');
    consoleLog(`req.codeEntreprise: ${req.codeEntreprise}`, 'blue');
    consoleLog(`internal: ${typeof next === 'function' ? 'false' : 'true'}`, 'blue');

    // Déterminer si c'est un appel interne ou non
    const internal = typeof next !== 'function';

    // Obtenir correctement codeEntreprise en fonction du contexte
    const codeEntreprise = internal ? req.codeEntreprise : (req.params.codeEntreprise || req.body.codeEntreprise);
    consoleLog(`Code de l'entreprise (déterminé): \t${codeEntreprise}`, 'green');

    if (!codeEntreprise) {
      throw new Error("Le code de l'entreprise est manquant.");
    }

    const company = await Company.findOne({ where: { comp_code: codeEntreprise } });

    if (!internal) {
      if (company) {
        res.status(200).json(company);
      } else {
        res.status(404).json({ message: "Company not found" });
      }
    } else {
      return company;
    }
  } catch (error) {
    console.error(`Erreur dans getCompanyByCode: ${error.message}`);
    if (typeof next === 'function') {
      res.status(500).json({ error: error.message });
    } else {
      throw new Error(error.message);
    }
  }
};




const createCompany = async (req, res, internal = false) => {
  try {
    const { comp_name, comp_siret, comp_addre, comp_posta, comp_city, comp_subsid=null } = req.body;

    // Check if the company already exists by SIRET
    let company = await Company.findOne({ where: { comp_siret } });

    if (!company) {
      // Create company if it does not exist
      const companyData = {
        comp_name,
        comp_siret,
        comp_addre,
        comp_posta,
        comp_city,
        comp_code : Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
        comp_subsid,
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

/*******************************/

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

  const codeEntreprise = req.body.comp_code;

  consoleLog(`Code de l'entreprise: \t${codeEntreprise}`, 'green');
  try {
    const company = await Company.findOne({
      where: {
        comp_code: codeEntreprise,
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
  getCompanyByCode,
  createCompany,
  validateCompany,
  validateCompanyCode,
};