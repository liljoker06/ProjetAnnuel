const { User } = require('../database/database');


const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const consoleLog = require('../consoleLog');

const { createCompany, createUserCompany } = require('./controllerUserCompany');
const { createSubscription } = require('./controllerSubscription');
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
  consoleLog('Débute la création de l\'utilisateur', 'green; font-size: 40px;');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Erreur de validation des données', 'color: red');
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { password, nom, prenom, email, phone, birth, adresse, codePostal, ville, nomEntreprise, siret, adresseEntreprise, codePostalEntreprise, cityCompany, plan } = req.body;

    consoleLog('Hachage de mot de passe en cours...', 'green');
    const hashedPassword = await bcrypt.hash(password, 10);
    consoleLog('Hachage de mot de passe réussi!', 'green');

    const userData = {
      user_fname: prenom,
      user_lname: nom,
      user_email: email,
      user_passw: hashedPassword,
      user_phone: phone,
      user_addr: adresse,
      user_posta: codePostal,
      user_city: ville,
      user_date: birth
    };

    consoleLog('Enregistrement de l\'utilisateur dans la base de données...', 'green');
    
    // Enregistrement de l'utilisateur dans la base de données
    const user = await User.create(userData);

    // Log après création de l'utilisateur
    consoleLog(`Utilisateur créé: \t${user.user_id}`, 'green');

    // Vérification que l'utilisateur a bien été créé et récupération de l'ID
    if (!user || !user.user_id) {
      console.error('Erreur: L\'utilisateur n\'a pas été créé correctement', 'color: red');
      return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
    }

    consoleLog(`Utilisateur enregistré avec succès, ID: ${user.user_id}`, 'green');

    consoleLog('Création ou recherche de l\'entreprise...', 'green');
    const company = await createCompany({ body: { comp_name: nomEntreprise, comp_siret: siret, comp_addre: adresseEntreprise, comp_posta: codePostalEntreprise, comp_city: cityCompany } }, res, true);

    consoleLog('Création de l\'entreprise en cours...', 'green');
    consoleLog(`Entreprise créée: \t${company.comp_id}`, 'green');
    if (!company || !company.comp_id) {
      console.error('Erreur: L\'entreprise n\'a pas été créée correctement', 'color: red');
      return res.status(500).json({ error: 'Erreur lors de la création de l\'entreprise.' });
    }

    consoleLog(`Entreprise enregistrée avec succès, ID: ${company.comp_id}`, 'green');

    consoleLog('Création de la relation utilisateur-entreprise...', 'green');
    await createUserCompany({ body: { user_id: user.user_id, comp_id: company.comp_id } }, res, true);
    consoleLog('Relation utilisateur-entreprise enregistrée avec succès', 'green');

    consoleLog('Création de l\'abonnement...', 'green');
    const subscription = await createSubscription({ body: { subs_name: plan } }, res, true);

    if (!subscription || !subscription.subs_id) {
      console.error('Erreur: L\'abonnement n\'a pas été créé correctement', 'color: red');
      return res.status(500).json({ error: 'Erreur lors de la création de l\'abonnement.' });
    }

    consoleLog(`Abonnement enregistré avec succès, ID: ${subscription.subs_id}`, 'green');

    consoleLog('Création de l\'abonnement courant...', 'green');
    await createCurrentSub({ body: { curs_userid: user.user_id, curs_subsid: subscription.subs_id } }, res, true);
    consoleLog('Abonnement courant enregistré avec succès', 'green');

    res.status(201).json({ user, company, subscription });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', 'color: red', error.message);
    res.status(500).json({ error: error.message });
  }
};




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
