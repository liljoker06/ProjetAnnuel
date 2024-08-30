const { User } = require('../database/database');

const bcrypt = require('bcryptjs');
const { parse, format } = require('date-fns');
const { validationResult } = require('express-validator');
const consoleLog = require('../consoleLog');

const { createCompany } = require('./controllerCompany');
const { createUserCompany } = require('./controllerUserCompany');
const { getSubscriptionByName } = require('./controllerSubscription');
const { createCurrentSub } = require('./controllerCurrentSub');


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  consoleLog('• [START] controllers/controllerUser/createUser', 'cyan');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    consoleLog('Erreur de validation aucune données à traiter', 'red');
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { password, nom, prenom, email, phone, birth, adresse, codePostal, ville, nomEntreprise, siret, adresseEntreprise, codePostalEntreprise, cityCompany, plan } = req.body;

    let hashedPassword;
    let formattedBirth;
    let user;
    let company;
    let userCompany;
    let subscription;
    let currentSub;

    // Hashage du mot de passe
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      consoleLog('Mot de passe hashé avec succès', 'green');
    } catch (error) {
      consoleLog('Erreur lors du hashage du mot de passe', 'red');
      return res.status(500).json({ error: error.message });
    }

    // Formatage de la date de naissance
    try {
      const parsedBirth = parse(birth, 'dd/MM/yyyy', new Date());
      formattedBirth = format(parsedBirth, 'yyyy-MM-dd');
      consoleLog('Date de naissance formatée avec succès', 'green');
    } catch (error) {
      consoleLog('Erreur lors du formatage de la date de naissance', 'red');
      return res.status(500).json({ error: error.message });
    }
    
    // Implémentation des données utilisateur
    const userData = {
      user_fname: prenom,
      user_lname: nom,
      user_email: email,
      user_passw: hashedPassword,
      user_phone: phone,
      user_addre: adresse,
      user_posta: codePostal,
      user_city: ville,
      user_date: formattedBirth,
    };

    // Création de l'utilisateur
    try {
      user = await User.create(userData);
      consoleLog(`Utilisateur créé : \t\t${user.user_id} - ${user.user_email}`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de la création de l\'utilisateur : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Création de l'entreprise
    try {
      company = await createCompany({ body: { comp_name: nomEntreprise, comp_siret: siret, comp_addre: adresseEntreprise, comp_posta: codePostalEntreprise, comp_city: cityCompany } }, res, true);
      consoleLog(`Entreprise créée : \t\t${company.comp_id} - ${company.comp_name}`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de la création de l\'entreprise : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Création de la liaison utilisateur-entreprise
    try {
      userCompany = await createUserCompany({ body: { user_id: user.user_id, comp_id: company.comp_id } }, res, true);
      consoleLog(`Liaison user-company créé : \t${user.user_email} + ${company.comp_name} = ID(${userCompany.id})`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de la création de la relation utilisateur-entreprise : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Attribution de l'abonnement à l'utilisateur
    try {
      subscription = await getSubscriptionByName(plan);
      user = await User.update({ user_subid: subscription.subs_id }, { where: { user_id: user.user_id } });
      consoleLog(`Abonnement ajouté : \t\t${email} -> ${subscription.subs_name}(ID : ${subscription.subs_id})`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de l\'attribution de l\'abonnement à l\'utilisateur : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Création de la liaison abonnement-utilisateur
    try {
      currentSub = await createCurrentSub({ body: { curs_userid: user.user_id, curs_subsid: subscription.subs_id } }, res, true);
      consoleLog(`Liaison user-currentSub créé : \t${email} + ${subscription.subs_name} = ID(${currentSub.curs_id})`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de la création de la liaison abonnement-utilisateur : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    consoleLog('[END] controllers/controllerUser/createUser', 'cyan');
    res.status(201).json({ user, company, subscription });
  } catch (error) {
    consoleLog('Erreur FATAL lors de la création de l\'utilisateur : ' + error.message, 'red');
    consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
    res.status(500).json({ error: error.message });
  }
};


/*******************************************************/


const validateUserEmail = async (req, res) => {

  consoleLog(`• [START] controllers/controllerUser/validateUserEmail`, 'cyan');
  try {
    const { user_email } = req.body;
    const user = await User.findOne({ where: { user_email } });

    if (user) {
      consoleLog(`Email déjà utilisé: \t${user_email}`, 'red');
    } else {
      consoleLog(`Email valide: \t\t${user_email}`, 'green');
    }

    res.status(200).json({ isValid: !user });
  }
  catch (error) {
    consoleLog(`Erreur lors de la validation de l'email: \t${error.message}`, 'red');
    res.status(500).json({ error: error.message });
  }

  consoleLog(`• [END] controllers/controllerUser/validateUserEmail`, 'cyan');
}

const validateUser = async (req, res) => {
  consoleLog(`• [START] controllers/controllerUser/validateUser`, 'cyan');
  try {
    const { user_email, user_passw } = req.body;
    const user = await User.findOne({ where: { user_email } });

    if (user) {
      // utilisation de bcrypt pour comparer les mots de passe qui sont hashés
      // const isValid = await bcrypt.compare(user_passw, user.user_passw);
      const isValid = user_passw === user.user_passw;
      if (isValid) {
        consoleLog(`Utilisateur valide: \t${user_email}`, 'green');
        consoleLog(`Mot de passe valide: \t${user_passw}`, 'green');
        consoleLog('Correspondance trouvée.', 'green');
        res.status(200).json({ isValid: true });
        consoleLog(`• [END] controllers/controllerUser/validateUser`, 'cyan');
        return;
      } else {
        consoleLog(`Utilisateur valide: \t${user_email}`, 'green');
        consoleLog(`Mot de passe invalide: \t${user_passw}`, 'red');
      }
    } else {
      consoleLog(`Utilisateur invalide: \t${user_email}`, 'red');
      consoleLog(`Mot de passe invalide: \t${user_passw}`, 'red');
    }

    res.status(200).json({ isValid: false });
  } catch (error) {
    consoleLog(`Erreur lors de la validation de l'utilisateur: \t${error.message}`, 'red');
    res.status(500).json({ error: error.message });
    consoleLog(`• [END] controllers/controllerUser/validateUser`, 'cyan');
  }

  consoleLog(`• [END] controllers/controllerUser/validateUser`, 'cyan');
};

module.exports = {
  getAllUsers,
  createUser,
  validateUserEmail,
  validateUser
};
