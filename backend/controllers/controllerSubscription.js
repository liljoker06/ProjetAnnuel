const { Subscription } = require('../database/database');

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubscriptionByName = async (subs_name) => {
  try {
    if (!subs_name) {
      throw new Error('Nom d\'abonnement requis');
    }

    const subscription = await Subscription.findOne({ where: { subs_name: subs_name } });

    if (subscription) {
      return subscription;
    } else {
      throw new Error('Abonnement pas trouvé');
    }
  } catch (error) {
    console.error('Error lors de la recherche d\'abonnement :', error);
    throw error;
  }
};

const createSubscription = async (req, res, internal = false) => {
  try {
    const subscription = await Subscription.create(req.body);

    if (!internal) {
      res.status(201).json(subscription);
    } else {
      return subscription;
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
  getAllSubscriptions,
  createSubscription,
  getSubscriptionByName,
};
