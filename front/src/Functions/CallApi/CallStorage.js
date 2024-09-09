import axios from "axios";
import Cookies from 'js-cookie'; // Utilisation dans le frontend
import FormData from 'form-data'; // Pour gérer FormData dans Node.js

// Vérifier la limite de stockage de l'utilisateur
export const checkStorageLimit = async (userId, fileSize) => {
  try {
    const token = Cookies.get('token'); // Récupérer le token d'authentification

    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await axios.get(`http://localhost:5555/api/userStorages/check`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ajouter le token d'authentification dans l'en-tête
      },
    });

    const { allowedStorage, usedStorage } = response.data;

    if (usedStorage + fileSize > allowedStorage) {
      throw new Error('Vous avez dépassé votre limite de stockage.');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification du stockage:', error.response?.data || error.message);
    throw error;
  }
};

// Uploader un fichier pour l'utilisateur
export const uploadFile = async (file, userId) => {
  try {
    const token = Cookies.get('token'); // Récupérer le token d'authentification

    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    // Utiliser form-data dans Node.js
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`http://localhost:5555/api/storagefile/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // Ajouter le token d'authentification dans l'en-tête
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error.response?.data || error.message);
    throw error;
  }
};

// Récupérer les fichiers de l'utilisateur
export const getUserFiles = async (userId) => {
  try {
    const token = Cookies.get('token'); // Récupérer le token d'authentification

    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await axios.get(`http://localhost:5555/api/storagefile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ajouter le token d'authentification dans l'en-tête
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des fichiers:', error.response?.data || error.message);
    throw error;
  }
};
