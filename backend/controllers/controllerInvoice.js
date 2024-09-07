const consoleLog = require('../consoleLog');
const jwt = require('jsonwebtoken');
const { Invoice } = require('../database/database');
const { User } = require('../database/database');
const { Company } = require('../database/database');
const { Subscription } = require('../database/database');


const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInvoicesById = async (req, res) => {
  try {
    const { invo_id } = req.params;

    const invoice = await Invoice.findOne({
      where: { invo_id },
      include: [
        {
          model: User,
          attributes: ['user_id', 'user_fname', 'user_lname', 'user_email']
        },
        {
          model: Company,
          attributes: ['comp_name', 'comp_addre', 'comp_posta', 'comp_city', 'comp_siret']
        },
        {
          model: Subscription,
          attributes: ['subs_name', 'subs_stora', 'subs_price', 'subs_nbuser', 'createdAt']
        }
      ]
    });
    consoleLog(`Facture trouvée : \t\t${invoice.invo_id}`, 'green');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Renvoyer les informations de la facture dans la réponse HTTP
    res.json({
      user_id: invoice.User.user_id,
      user_fname: invoice.User.user_fname,
      user_lname: invoice.User.user_lname,
      user_email: invoice.User.user_email,
      comp_name: invoice.Company.comp_name,
      comp_addre: invoice.Company.comp_addre,
      comp_posta: invoice.Company.comp_posta,
      comp_city: invoice.Company.comp_city,
      comp_siret: invoice.Company.comp_siret,
      subs_name: invoice.Subscription.subs_name,
      subs_stora: invoice.Subscription.subs_stora,
      subs_price: invoice.Subscription.subs_price,
      subs_nbuser: invoice.Subscription.subs_nbuser,
      createdAt: invoice.Subscription.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getInvoicesByUserId = async (req, res) => {
  try {

    consoleLog('• [START] controllers/controllerInvoice/getInvoicesByUserId', 'cyan');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      consoleLog('Aucun en-tête d\'autorisation trouvé', 'red');
      return res.status(401).json({ message: 'Aucun en-tête d\'autorisation trouvé' });
    }

    const token = authHeader.split(' ')[1];

    // Vérification de la présence du token
    if (!token) {
      consoleLog('Aucun token trouvé', 'red');
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
    const user = await User.findByPk(userId);
    if (!user) {
      consoleLog(`Utilisateur non trouvé : \t\t${userId}`, 'red');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    consoleLog(`Utilisateur trouvé : \t\t${user.user_id} - ${user.user_email}`, 'green');

    // Récupération des factures
    const invoices = await Invoice.findAll({
      where: { invo_userid: userId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'user_fname', 'user_lname', 'user_email']
        },
        {
          model: Company,
          attributes: ['comp_name', 'comp_addre', 'comp_posta', 'comp_city', 'comp_siret']
        },
        {
          model: Subscription,
          attributes: ['subs_name', 'subs_stora', 'subs_price', 'subs_nbuser', 'createdAt']
        }
      ]
    });

    if (!invoices.length) {
      return res.status(404).json({ message: 'Aucune facture trouvée' });
    }

    consoleLog(`Factures trouvées : \t\t${invoices.length}`, 'green');

    consoleLog('• [END] controllers/controllerInvoice/getInvoicesByUserId', 'cyan');

    // Renvoyer les informations des factures dans la réponse HTTP
    res.json(invoices.map(invoice => ({
      invo_id: invoice.invo_id,
      user_id: invoice.User.user_id,
      user_fname: invoice.User.user_fname,
      user_lname: invoice.User.user_lname,
      user_email: invoice.User.user_email,
      comp_name: invoice.Company.comp_name,
      comp_addre: invoice.Company.comp_addre,
      comp_posta: invoice.Company.comp_posta,
      comp_city: invoice.Company.comp_city,
      comp_siret: invoice.Company.comp_siret,
      subs_name: invoice.Subscription.subs_name,
      subs_stora: invoice.Subscription.subs_stora,
      subs_price: invoice.Subscription.subs_price,
      subs_nbuser: invoice.Subscription.subs_nbuser,
      createdAt: invoice.Subscription.createdAt
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const createInvoice = async (invoiceData) => {
  const { invo_userid, invo_compid, invo_subsid, invo_cursid, invo_tva } = invoiceData;

  // Vérification des données d'entrée
  if (!invo_userid || !invo_compid || !invo_subsid || !invo_cursid || !invo_tva) {
    throw new Error('Tous les champs sont requis.');
  }

  try {
    const invoice = await Invoice.create({
      invo_userid,
      invo_compid,
      invo_subsid,
      invo_cursid,
      invo_tva
    });

    if (!invoice) {
      throw new Error('La création de la facture a échoué.');
    }

    return invoice;
  } catch (error) {
    console.error('Erreur lors de la création de la facture :', error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  getAllInvoices,
  getInvoicesById,
  getInvoicesByUserId,
  createInvoice,
};
