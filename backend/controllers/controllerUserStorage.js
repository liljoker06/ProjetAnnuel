const { UserStorage, CurrentSub, Subscription } = require('../database/database');
const { getSubscriptionById } = require('../controllers/controllerSubscription'); // Importer la fonction pour obtenir l'abonnement

const getAllUserStorages = async (req, res) => {
  try {
    const userStorages = await UserStorage.findAll();
    res.status(200).json(userStorages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUserStorage = async (req, res) => {
  try {
    const userStorage = await UserStorage.create(req.body);
    res.status(201).json(userStorage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vérification de la limite de stockage de l'utilisateur
const checkStorageLimit = async (req, res) => {
  try {
    const { userId } = req.params; // Récupère l'ID utilisateur depuis les paramètres

    // Trouver l'abonnement de l'utilisateur dans la table currentsubs
    const currentSub = await CurrentSub.findOne({ where: { curs_userid: userId } });
    
    if (!currentSub) {
      return res.status(404).json({ message: 'Abonnement non trouvé pour cet utilisateur.' });
    }

    // Utilise la fonction getSubscriptionById pour obtenir l'abonnement
    const subscription = await getSubscriptionById(currentSub.curs_subsid);

    if (!subscription) {
      return res.status(404).json({ message: 'Souscription non trouvée.' });
    }

    // Récupérer la capacité de stockage allouée
    const allowedStorage = subscription.subs_stora * 1024 * 1024 * 1024; // Convertir en octets

    // Optionnel : Récupérer l'espace utilisé par l'utilisateur (si cela est stocké)
    const userStorage = await UserStorage.findOne({ where: { user_id: userId } });
    const usedStorage = userStorage ? userStorage.used_storage : 0; // Utilise 0 s'il n'y a pas encore de stockage utilisé

    res.status(200).json({ allowedStorage, usedStorage });
  } catch (error) {
    console.error('Erreur lors de la vérification du stockage:', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};


const updateDispoStorage = async (userId) => {
  try {
    // Trouver l'abonnement de l'utilisateur dans la table currentsubs
    const currentSub = await CurrentSub.findOne({ where: { curs_userid: userId } });

    if (!currentSub) {
      throw new Error('Abonnement non trouvé pour cet utilisateur.');
    }

    // Trouver les informations de l'abonnement dans la table subscriptions
    const subscription = await Subscription.findOne({ where: { subs_id: currentSub.curs_subsid } });

    if (!subscription) {
      throw new Error('Souscription non trouvée.');
    }

    // Récupérer la capacité de stockage allouée
    const allowedStorage = subscription.subs_stora * 1024 * 1024 * 1024; // Convertir en octets

    // Optionnel : Récupérer l'espace utilisé par l'utilisateur (si cela est stocké)
    const userStorage = await UserStorage.findOne({ where: { user_id: userId } });

    if (!userStorage) {
      throw new Error('Stockage utilisateur non trouvé.');
    }

    const usedStorage = userStorage.used_storage; // Stockage déjà utilisé
    const dispoStorage = allowedStorage - usedStorage; // Stockage disponible

    // Mettre à jour le stockage disponible dans la base de données
    userStorage.dispo_storage = dispoStorage;
    await userStorage.save();

    return { allowedStorage, usedStorage, dispoStorage };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stockage disponible:', error);
    throw error;
  }
};


module.exports = {
  getAllUserStorages,
  createUserStorage,
  checkStorageLimit,
  updateDispoStorage,
};
