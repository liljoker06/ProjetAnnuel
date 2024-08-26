const { User } = require('../database/database');
const { Company } = require('../database/database');
const { Subscription } = require('../database/models/modelSubscription');
const { UserCompany } = require('../database/models/modelUserCompany');
const { CurrentSub } = require('../database/models/modelCurrentSub');
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


module.exports = {
  getAllUsers,
  createUser,
};
