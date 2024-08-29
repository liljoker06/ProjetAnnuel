const { User } = require('../database/database');
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { password } = req.body;

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
