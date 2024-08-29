const { User } = require('../database/database');

const { Company } = require('../database/database');
const { Subscription } = require('../database/models/modelSubscription');
const { UserCompany } = require('../database/models/modelUserCompany');
const { CurrentSub } = require('../database/models/modelCurrentSub');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const consoleLog = require('../consoleLog');


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createUser = async (req, res) => {
  console.log('cc fdp');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    const { password, nom, prenom, email, phone, birth, adresse, codePostal, ville, nomEntreprise, siret, adresseEntreprise, codePostalEntreprise, cityCompany, plan } = req.body;

    console.log('cc fdp2');
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('cc fdp3');
    // Create user object
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

    console.log('cc fdp4');
    // Save user to database
    const user = await User.create(userData);

    console.log('cc fdp5');
    // Assuming you have models for companies and subscriptions, handle them accordingly

    // Create company object
    const companyData = {
      comp_name: nomEntreprise,
      comp_siret: siret,
      comp_addre: adresseEntreprise,
      comp_posta: codePostalEntreprise,
      comp_city: cityCompany
    };

    const company = await Company.create(companyData);

    // Create user-company relationship
    await UserCompany.create({
      user_id: user.id,
      comp_id: company.id
    });

    // Create subscription object
    const subscriptionData = {
      subs_name: plan,
      // Include other fields related to subscriptions if needed
    };

    const subscription = await Subscription.create(subscriptionData);

    // Create current subscription for the user
    await CurrentSub.create({
      curs_userid: user.id,
      curs_subsid: subscription.id,
      curs_start: new Date(), // Set appropriate start date
      curs_end: null // Set end date if available
    });

    res.status(201).json({ user, company, subscription });
  } catch (error) {
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
