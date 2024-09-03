const { User } = require('../database/database');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { parse, format } = require('date-fns');
const { validationResult } = require('express-validator');
const consoleLog = require('../consoleLog');

const { createCompany, getCompanyByCode, getCompanyById } = require('./controllerCompany');
const { createUserCompany, getUserCompanyByUser } = require('./controllerUserCompany');
const { getSubscriptionByName, getSubscriptionById } = require('./controllerSubscription');
const { createCurrentSub } = require('./controllerCurrentSub');
const { createInvoice } = require('./controllerInvoice');
const { connexionMail, welcomeMail, welcomeMail2 } = require('./controllerMailCode');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByMail = async (email) => {
  try {
    const user = await User.findOne({ where: { user_email: email } });
    return user;
  } catch (error) {
    throw new Error('Erreur lors de la récupération de l\'utilisateur : ' + error.message);
  }
};

// pas fini
const getUserInfoByToken = async (req, res) => {
  consoleLog('• [START] controllers/controllerUser/getUserInfoByToken', 'cyan');

  let user;
  let company;
  let subscription;
  let userCompany;
  let userStorage;
  let userFiles;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      consoleLog('Aucun en-tête d\'autorisation trouvé', 'red');
      return res.status(401).json({ message: 'Aucun en-tête d\'autorisation trouvé' });
    }

    const token = authHeader.split(' ')[1];

    // Vérification de la présence du token
    if (!token) {
      consoleLog('Aucun token trouvé', 'red');
      consoleLog('• [END] controllers/controllerUser/getUserInfoByToken', 'cyan');
      return res.status(401).json({ message: 'Aucun token trouvé' });
    }

    // Vérification du token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    consoleLog(`Token reçu : ` + JSON.stringify(decodedToken), 'green');
    const userId = decodedToken.userId;
    const exp = decodedToken.exp;

    // Vérification de l'expiration du token
    if (Date.now() >= exp * 1000) {
      consoleLog('Token expiré', 'red');
      return res.status(401).json({ message: 'Token expiré' });
    }
    consoleLog('Token valide', 'green');


    // Récupération de l'utilisateur
    user = await User.findByPk(userId);
    if (!user) {
      consoleLog(`Utilisateur non trouvé : \t\t${userId}`, 'red');
      consoleLog('• [END] controllers/controllerUser/getUserInfoByToken', 'cyan');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    consoleLog(`Utilisateur trouvé : \t\t${user.user_id} - ${user.user_email}`, 'green');

    // trouver l'entreprise de l'utilisateur
    userCompany = await getUserCompanyByUser(user.user_id, null, true);
    if (!userCompany) {
      consoleLog('L\'utilisateur n\'a pas d\'entreprise', 'red');
      consoleLog('• [END] controllers/controllerUser/getUserInfoByToken', 'cyan');
      return res.status(404).json({ message: 'L\'utilisateur n\'a pas d\'entreprise' });
    } else {
      // trouver l'entreprise
      consoleLog(`Liaison user-company trouvée : \t${userCompany.id}`, 'green');
      company = await getCompanyById(userCompany.comp_id, null, true);
      if (!company) {
        consoleLog(`Entreprise non trouvée : \t${userCompany.comp_id}`, 'red');
        consoleLog('• [END] controllers/controllerUser/getUserInfoByToken', 'cyan');
        return res.status(404).json({ message: 'Entreprise non trouvée' });
      }
      consoleLog(`Entreprise trouvée : \t\t${company.comp_id} - ${company.comp_name}`, 'green');
    }

    // Récupération de l'abonnement de l'utilisateur
    subscription = await getSubscriptionById(user.user_subid);
    if (!subscription) {
      consoleLog('Abonnement non trouvé', 'red');
      consoleLog('• [END] controllers/controllerUser/getUserInfoByToken', 'cyan');
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }
    consoleLog(`Abonnement trouvé : \t\t${subscription.subs_id} - ${subscription.subs_name}`, 'green');

    // récupération de son espace de stockage

    // récupération de ses fichiers

    // récupération de son historique d'activité

    // formatage des données pour l'envoi
    const userInfo = {
      user_id: user.user_id,
      user_fname: user.user_fname,
      user_lname: user.user_lname,
      user_email: user.user_email,
      user_company: company.comp_name,
      user_subscription: subscription.subs_name,
      user_storageTotal: subscription.subs_stora,
      user_storageUsed: 5,    // à modifier pour récupérer l'espace utilisé
      user_files: 0,          // à modifier pour récupérer le nombre de fichiers
    };

    consoleLog(`Informations à envoyer : \t${JSON.stringify(userInfo)}`, 'green');


    consoleLog('• [END] controllers/controllerUser/getUserInfo', 'cyan');
    return res.status(200).json({ userInfo });
  } catch (error) {
    consoleLog(`Erreur lors de la récupération des informations de l'utilisateur: ${error.message}`, 'red');
    return res.status(500).json({ message: 'Erreur interne du serveur' });
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
    const { password, nom, prenom, email, phone, birth, adresse, codePostal, ville, nomEntreprise = null, siret = null, adresseEntreprise = null, codePostalEntreprise = null, cityCompany = null, plan = null, codeEntreprise = null } = req.body;

    consoleLog('affichage des données', 'cyan');
    consoleLog('Nom: ' + nom, 'cyan');
    consoleLog('Prénom: ' + prenom, 'cyan');
    consoleLog('Email: ' + email, 'cyan');
    consoleLog('Téléphone: ' + phone, 'cyan');
    consoleLog('Date de naissance: ' + birth, 'cyan');
    consoleLog('Adresse: ' + adresse, 'cyan');
    consoleLog('Code postal: ' + codePostal, 'cyan');
    consoleLog('Ville: ' + ville, 'cyan');
    consoleLog('Nom de l\'entreprise: ' + nomEntreprise, 'cyan');
    consoleLog('Siret: ' + siret, 'cyan');
    consoleLog('Adresse de l\'entreprise: ' + adresseEntreprise, 'cyan');
    consoleLog('Code postal de l\'entreprise: ' + codePostalEntreprise, 'cyan');
    consoleLog('Ville de l\'entreprise: ' + cityCompany, 'cyan');
    consoleLog('Plan: ' + plan, 'cyan');
    consoleLog('Code de l\'entreprise: ' + codeEntreprise, 'cyan');

    let hashedPassword;
    let formattedBirth;
    let user;
    let company;
    let userCompany;
    let subscription;
    let currentSub;
    let companySub;

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

    consoleLog('Données utilisateur avant création : ' + JSON.stringify(userData), 'cyan');

    // Création de l'utilisateur
    try {
      user = await User.create(userData);
      consoleLog(`Utilisateur créé : \t\t\t${user.user_id} - ${user.user_email}`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de la création de l\'utilisateur : ' + error.message, 'red');
      if (error.errors) {
        error.errors.forEach(err => {
          consoleLog(`Validation error: ${err.message}`, 'red');
        });
      }
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Création/Liaison de l'entreprise
    if (codeEntreprise) {

      try {
        try {
        company = await getCompanyByCode({ codeEntreprise: values.codeCompany }, true);
        consoleLog(`Entreprise trouvée : \t\t\t${company.comp_id} - ${company.comp_name} - (Code: ${company.comp_code})`, 'green');
        } catch (error) {
          consoleLog('Erreur lors de la récupération de l\'entreprise : ' + error.message, 'red');
          consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
          return res.status(500).json({ error: error.message });
        }
        try {
          companySub = await getSubscriptionById(company.comp_subsid);
          consoleLog(`Abonnement trouvé : \t\t\t${companySub.subs_id} - ${companySub.subs_name}`, 'green');
        } catch (error) {
          consoleLog('Erreur lors de la récupération de l\'abonnement de l\'entreprise : ' + error.message, 'red');
          consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
          return res.status(500).json({ error: error.message });
        }

      } catch (error) {
        consoleLog('Erreur lors de la récupération de l\'entreprise ou de son abonnement : ' + error.message, 'red');
        consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
        return res.status(500).json({ error: error.message });
      }

    } else {

      try {
        subscription = await getSubscriptionByName(plan);
        company = await createCompany({ body: { comp_name: nomEntreprise, comp_siret: siret, comp_addre: adresseEntreprise, comp_posta: codePostalEntreprise, comp_city: cityCompany, comp_subsid: subscription.subs_id } }, res, true);
        consoleLog(`Entreprise créée : \t\t\t${company.comp_id} - ${company.comp_name}`, 'green');
      } catch (error) {
        consoleLog('Erreur lors de la création de l\'entreprise : ' + error.message, 'red');
        consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
        return res.status(500).json({ error: error.message });
      }

    }

    // Création de la liaison utilisateur-entreprise
    try {
      userCompany = await createUserCompany({ body: { user_id: user.user_id, comp_id: company.comp_id } }, res, true);
      consoleLog(`Liaison user-company créé : \t\t${user.user_email} + ${company.comp_name} = ID(${userCompany.id})`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de la création de la relation utilisateur-entreprise : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Attribution de l'abonnement à l'utilisateur
    try {
      if (companySub) {
        subscription = companySub;
      }
      await User.update({ user_subid: subscription.subs_id }, { where: { user_id: user.user_id } });
      consoleLog(`Abonnement ajouté : \t\t\t${user.user_email} -> ${subscription.subs_name}(ID : ${subscription.subs_id})`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de l\'attribution de l\'abonnement à l\'utilisateur : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Création de la liaison abonnement-utilisateur
    try {
      currentSub = await createCurrentSub({ body: { curs_userid: user.user_id, curs_subsid: subscription.subs_id } }, res, true);
      consoleLog(`Liaison user-currentSub créé : \t\t${user.user_email} + ${subscription.subs_name} = ID(${currentSub.curs_id})`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de la création de la liaison abonnement-utilisateur : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Création de la facture et/ou envoi du mail de bienvenue
    if (!codeEntreprise) {
      // Création de la facture
      try {
        const invoiceData = {
          invo_userid: user.user_id,
          invo_compid: company.comp_id,
          invo_subsid: subscription.subs_id,
          invo_cursid: currentSub.curs_id,
          invo_tva: 20
        };
        const invoice = await createInvoice(invoiceData);
        consoleLog(`Facture créée : \t\t\t${invoice.invo_id} - ${subscription.subs_name} - ${user.user_email}`, 'green');
      } catch (error) {
        consoleLog('Erreur lors de la création de la facture : ' + error.message, 'red');
        consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
        return res.status(500).json({ error: error.message });
      }

      // Envoi du mail de bienvenue
      try {
        await welcomeMail(user, subscription, company);
        consoleLog('Mail de bienvenue envoyé avec succès', 'green');
      } catch (error) {
        consoleLog('Erreur lors de l\'envoi du mail de bienvenue', 'red');
        return res.status(500).json({ error: error.message });
      }

    } else {
      // Envoi du mail de bienvenue2
      try {
        await welcomeMail2(user, subscription, company);
        consoleLog('Mail de bienvenue2 envoyé avec succès', 'green');
      } catch (error) {
        consoleLog('Erreur lors de l\'envoi du mail de bienvenue2', 'red');
        return res.status(500).json({ error: error.message });
      }
    }

    // Si tout est réussi, renvoyer une réponse de succès
    consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
    return res.status(201).json({ message: 'Utilisateur créé avec succès', user });

  } catch (error) {
    consoleLog('Erreur FATAL lors de la création de l\'utilisateur : ' + error.message, 'red');
    consoleLog('• [END] controllers/controllerUser/createUser', 'cyan');
    return res.status(500).json({ error: error.message });
  }
};

// FAIRE UNE GESTION DE TOKEN DANS UN COOKIE
const loginUser = async (req, res) => {
  consoleLog('• [START] controllers/controllerUser/loginUser', 'cyan');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    consoleLog('Erreur de validation aucune données à traiter', 'red');
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { password, email } = req.body;

    let user;
    let hashedPassword;

    // Récupération de l'utilisateur
    try {
      user = await User.findOne({ where: { user_email: email } });
      if (!user) {
        consoleLog('Utilisateur non trouvé', 'red');
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      consoleLog(`Utilisateur trouvé : \t\t${user.user_id} - ${user.user_email}`, 'green');
    } catch (error) {
      consoleLog('Erreur lors de la récupération de l\'utilisateur : ' + error.message, 'red');
      consoleLog('• [END] controllers/controllerUser/loginUser', 'cyan');
      return res.status(500).json({ error: error.message });
    }

    // Vérification du mot de passe
    try {
      const isPasswordValid = await bcrypt.compare(password, user.user_passw);
      if (!isPasswordValid) {
        consoleLog('Mot de passe incorrect', 'red');
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
      consoleLog('Mot de passe vérifié avec succès', 'green');
    } catch (error) {
      consoleLog('Erreur lors de la vérification du mot de passe', 'red');
      return res.status(500).json({ error: error.message });
    }

    // Génération du jeton JWT
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Définir le cookie avec le jeton JWT
    res.cookie('token', token, {
      // httpOnly: true,    // Empêche l'accès au cookie via JavaScript
      // secure: true,      //Utilisez true en production pour envoyer le cookie uniquement via HTTPS
      sameSite: 'strict',   // Aide à prévenir les attaques CSRF
      maxAge: 3600000       // Durée de vie du cookie (1 heure en millisecondes)
    });
    // Envoi du mail de connexion
    try {
      await connexionMail(user, req.ip);
      consoleLog('Mail de connexion envoyé avec succès', 'green');
    } catch (error) {
      consoleLog('Erreur lors de l\'envoi du mail de connexion', 'red');
      return res.status(500).json({ error: error.message });
    }

    // Envoyer le token de connexion


    consoleLog('• [END] controllers/controllerUser/conectUser', 'cyan');
    return res.status(200).json({ message: 'Utilisateur connecté avec succès', success: true, token });


  } catch (error) {
    consoleLog('Erreur FATAL lors de la connexion de l\'utilisateur : ' + error.message, 'red');
    consoleLog('• [END] controllers/controllerUser/loginUser', 'cyan');
    return res.status(500).json({ error: error.message });
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
      const isValid = await bcrypt.compare(user_passw, user.user_passw);
      // const isValid = user_passw === user.user_passw;
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
  getUserByMail,
  getUserInfoByToken,
  createUser,
  loginUser,
  validateUserEmail,
  validateUser
};
