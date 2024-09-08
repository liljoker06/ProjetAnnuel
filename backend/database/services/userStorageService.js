const { UserStorage } = require('../models'); // Assure-toi que le chemin est correct pour accéder à tes modèles
const { v4: uuidv4 } = require('uuid'); // Pour générer des UUID

/**
 * Crée une entrée dans la table UserStorage pour un utilisateur donné.
 * 
 * @param {string} userId - ID de l'utilisateur pour qui créer l'entrée.
 * @param {number} subs_id - ID de l'abonnement auquel l'utilisateur est lié.
 * @param {number} [used_storage=0] - Espace de stockage déjà utilisé par l'utilisateur (par défaut à 0).
 */
const createUserStorageEntry = async (userId, subs_id, used_storage = 0) => {
  try {
    const stor_id = uuidv4(); // Générer un UUID pour l'identifiant de stockage
    const dispo_storage = await getAvailableStorage(subs_id); // Récupérer le stockage disponible pour l'abonnement
    
    // Création de l'entrée UserStorage
    const newUserStorage = await UserStorage.create({
      stor_id, 
      user_id: userId,
      subs_id, 
      used_storage, 
      dispo_storage, // Stockage disponible calculé en fonction de l'abonnement
    });

    console.log(`[SUCCESS] UserStorage entry created for userId: ${userId} with stor_id: ${stor_id}`);
    return newUserStorage;
  } catch (error) {
    console.error(`[ERROR] Failed to create UserStorage entry: ${error.message}`);
    throw error;
  }
};

/**
 * Récupère le stockage disponible basé sur l'abonnement.
 * 
 * @param {number} subs_id - L'ID de l'abonnement auquel l'utilisateur est lié.
 * @returns {number} - Le stockage disponible en fonction de l'abonnement.
 */
const getAvailableStorage = async (subs_id) => {
  try {
    // Trouver les informations de l'abonnement dans la table subscriptions
    const subscription = await Subscription.findOne({ where: { subs_id } });

    if (!subscription) {
      throw new Error('Souscription non trouvée.');
    }

    // Retourne la capacité de stockage allouée pour cet abonnement
    return subscription.subs_stora * 1024; // Convertir en Mo ou en octets selon le besoin
  } catch (error) {
    console.error(`[ERROR] Failed to get available storage for subs_id: ${subs_id} - ${error.message}`);
    throw error;
  }
};

/**
 * Met à jour l'espace de stockage utilisé pour un utilisateur.
 * 
 * @param {string} userId - L'ID de l'utilisateur.
 * @param {number} additionalStorage - La quantité d'espace supplémentaire utilisée par l'utilisateur.
 */
const updateUsedStorage = async (userId, additionalStorage) => {
  try {
    // Récupérer l'entrée UserStorage pour l'utilisateur
    const userStorage = await UserStorage.findOne({ where: { user_id: userId } });

    if (!userStorage) {
      throw new Error(`Aucune entrée UserStorage trouvée pour l'utilisateur ${userId}`);
    }

    // Ajouter l'espace de stockage supplémentaire et mettre à jour
    userStorage.used_storage += additionalStorage;
    await userStorage.save();

    console.log(`[SUCCESS] Updated used storage for userId: ${userId}`);
    return userStorage;
  } catch (error) {
    console.error(`[ERROR] Failed to update used storage for userId: ${userId} - ${error.message}`);
    throw error;
  }
};

module.exports = {
  createUserStorageEntry,
  getAvailableStorage,
  updateUsedStorage,
};
